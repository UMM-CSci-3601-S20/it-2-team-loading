package umm3601.post;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;


/**
* Tests the logic of the OwnerController
*
* @throws IOException
*/
public class PostControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private PostController postController;

  private ObjectId samsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }


  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

        // Setup database
    MongoCollection<Document> postDocuments = db.getCollection("posts");
    postDocuments.drop();
    List<Document> testPosts = new ArrayList<>();
    testPosts.add(Document.parse("{\n" +
      "                    message: \"I wanna say something,\",\n" +
      "                    owner_id: \"1310\",\n" +
      "                }"));
    testPosts.add(Document.parse("{\n" +
      "                    message: \"But we're leaving\",\n" +
      "                    owner_id: \"1523\",\n" +
      "                }"));
    testPosts.add(Document.parse("{\n" +
      "                    message: \"And it's over\",\n" +
      "                    owner_id: \"1600\",\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("message", "Sam's message")
      .append("owner_id", "1300");


    postDocuments.insertMany(testPosts);
    postDocuments.insertOne(Document.parse(sam.toJson()));

    postController = new PostController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetPostsByOwner_id() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("owner_id=1310");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/posts");

    postController.getOwnerPosts(ctx);

    String result = ctx.resultString();
    Post[] resultPosts = JavalinJson.fromJson(result, Post[].class);

    assertEquals(1, resultPosts.length); // There should be one owner returned
    for (Post post : resultPosts) {
      assertEquals("1310", post.owner_id); // There should be one with that id
    }
  }

  @Test
  public void AddPost() throws IOException {

    String testNewPost = "{\n\t\"message\": \"Alien\",\n\t\"owner_id\": \"coolguyid\"\n}";

    mockReq.setBodyContent(testNewPost);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owner:id/posts/new");

    postController.addNewPost(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("posts").countDocuments(eq("_id", new ObjectId(id))));

    //verify owner was added to the database and the correct ID
    Document addedPost = db.getCollection("posts").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedPost);
    assertEquals("Alien", addedPost.getString("message"));
  }

  @Test
  public void DeletePost() throws IOException {

    String testID = samsId.toHexString();

    // Sam exists in the database before we delete him
    assertEquals(1, db.getCollection("posts").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/posts", ImmutableMap.of("id", testID));
    postController.deletePost(ctx);

    assertEquals(200, mockRes.getStatus());

    // Owner is no longer in the database
    assertEquals(0, db.getCollection("posts").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  public void getPost() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/posts/:id", ImmutableMap.of("id", testID));
    postController.getPost(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Post resultPost = JavalinJson.fromJson(result, Post.class);

    assertEquals(resultPost._id, samsId.toHexString());
    assertEquals(resultPost.owner_id, "1300");
  }

}
