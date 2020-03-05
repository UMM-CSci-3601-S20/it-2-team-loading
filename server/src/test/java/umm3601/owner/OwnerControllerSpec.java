package umm3601.owner;

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
public class OwnerControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private OwnerController ownerController;

  private ObjectId rachaelId;

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
    MongoCollection<Document> ownerDocuments = db.getCollection("owners");
    ownerDocuments.drop();
    List<Document> testOwners = new ArrayList<>();
    testOwners.add(Document.parse("{\n" +
    "                    name: \"Rachael Johnson\",\n" +
    "                    officeID: 1310,\n" +
    "                    building: \"Science\",\n" +
    "                    email: \"rmjohns@morris.umn.edu\",\n" +
    "                    role: \"admin\",\n" +
    "                    avatar: \"https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon\"\n" +
    "                }"));
    testOwners.add(Document.parse("{\n" +
    "                    name: \"Robert Denton\",\n" +
    "                    officeID: 2065,\n" +
    "                    building: \"Science\",\n" +
    "                    email: \"rdenton@morris.umn.edu\",\n" +
    "                    role: \"editor\",\n" +
    "                    avatar: \"https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon\"\n" +
    "                }"));
    testOwners.add(Document.parse("{\n" +
    "                    name: \"Emily Bruce\",\n" +
    "                    officeID: 118,\n" +
    "                    building: \"Camden\",\n" +
    "                    email: \"bruce088@morris.umn.edu\",\n" +
    "                    role: \"viewer\",\n" +
    "                    avatar: \"https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon\"\n" +
    "                }"));

    rachaelId = new ObjectId();
    BasicDBObject rachael = new BasicDBObject("_id", rachaelId);
    rachael = rachael.append("name", "Sam")
      .append("officeID", 1310)
      .append("building", "Science")
      .append("email", "rmjohns@morris.umn.edu")
      .append("role", "viewer")
      .append("avatar", "https://gravatar.com/avatar/08b7610b558a4cbbd20ae99072801f4d?d=identicon");


    ownerDocuments.insertMany(testOwners);
    ownerDocuments.insertOne(Document.parse(rachael.toJson()));

    ownerController = new OwnerController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  /*
  @Test
  public void GetAllOwners() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("owners").countDocuments(), JavalinJson.fromJson(result, Owner[].class).length);
  }

  @Test
  public void GetOwnersByOfficeID() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("officeID=1375");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");

    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();
    Owner[] resultOwners = JavalinJson.fromJson(result, Owner[].class);

    assertEquals(2, resultOwners.length); // There should be two owners returned
    for (Owner owner : resultOwners) {
      assertEquals(37, owner.officeID); // Every owner should be officeID 37
    }
  }

  /**
  * Test that if the owner sends a request with an illegal value in
  * the officeID field (i.e., something that can't be parsed to a number)
  * we get a reasonable error code back.
  */


  /*
  @Test
  public void GetOwnersWithIllegalOfficeID() {

    mockReq.setQueryString("officeID=abc");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");

    // This should now throw a `BadRequestResponse` exception because
    // our request has an officeID that can't be parsed to a number.
    assertThrows(BadRequestResponse.class, () -> {
      ownerController.getOwners(ctx);
    });
  }
  */

  /*
  @Test
  public void GetOwnersByBuilding() throws IOException {

    mockReq.setQueryString("building=Science");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    Owner[] resultOwners = JavalinJson.fromJson(result, Owner[].class);

    assertEquals(2, resultOwners.length); // There should be two owners returned
    for (Owner owner : resultOwners) {
      assertEquals("Science", owner.building);
    }
  }

  @Test
  public void GetOwnersByEmail() throws IOException {

    mockReq.setQueryString("rdenton@morris.umn.edu");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    for (Owner owner : JavalinJson.fromJson(result, Owner[].class)) {
      assertEquals("rdenton@morris.umn.edu", owner.email);
    }
  }

  @Test
  public void GetOwnersByBuildingAndOfficeID() throws IOException {

    mockReq.setQueryString("building=Science&officeID=2065");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    Owner[] resultOwners = JavalinJson.fromJson(result, Owner[].class);

    assertEquals(1, resultOwners.length); // There should be one owner returned
    for (Owner owner : resultOwners) {
       assertEquals("Science", owner.building);
       assertEquals(2065, owner.officeID);
     }
  }
  */

  /*
  @Test
  public void GetOwnerWithExistentId() throws IOException {

    String testID = rachaelId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/:id", ImmutableMap.of("id", testID));
    ownerController.getOwner(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Owner resultOwner = JavalinJson.fromJson(result, Owner.class);

    assertEquals(resultOwner._id, rachaelId.toHexString());
    assertEquals(resultOwner.name, "Rachael");
  }

  @Test
  public void GetOwnerWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/:id", ImmutableMap.of("id", "bad"));

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.getOwner(ctx);
    });
  }

  @Test
  public void GetOwnerWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      ownerController.getOwner(ctx);
    });
  }

  @Test
  public void AddOwner() throws IOException {

    String testNewOwner = "{\n\t\"name\": \"Robert Denton\",\n\t\"officeID\":2065,\n\t\"building\": \"Science\",\n\t\"email\": \"rdenton@morris.umn.edu\",\n\t\"}";

    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    ownerController.addNewOwner(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("owners").countDocuments(eq("_id", new ObjectId(id))));

    //verify owner was added to the database and the correct ID
    Document addedOwner = db.getCollection("owners").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedOwner);
    assertEquals("Test Owner", addedOwner.getString("name"));
    assertEquals(25, addedOwner.getString("officeID"));
    assertEquals("testers", addedOwner.getString("building"));
    assertEquals("test@example.com", addedOwner.getString("email"));
    //assertEquals("viewer", addedOwner.getString("role"));
    //assertTrue(addedOwner.containsKey("avatar"));
  }
  */

  @Test
  public void AddInvalidEmailOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": \"Test Owner\",\n\t\"officeID\":25,\n\t\"building\": \"testers\",\n\t\"email\": \"invalidemail\",\n\t\"role\": \"viewer\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  @Test
  public void AddInvalidAgeOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": \"Test Owner\",\n\t\"officeID\":\"notanumber\",\n\t\"building\": \"testers\",\n\t\"email\": \"test@example.com\",\n\t\"role\": \"viewer\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  @Test
  public void AddInvalidNameOwner() throws IOException {
    String testNewOwner = "{\n\t\"officeID\":25,\n\t\"building\": \"testers\",\n\t\"email\": \"test@example.com\",\n\t\"role\": \"viewer\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  @Test
  public void AddInvalidRoleOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": \"Test Owner\",\n\t\"officeID\":25,\n\t\"building\": \"testers\",\n\t\"email\": \"test@example.com\",\n\t\"role\": \"invalidrole\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  @Test
  public void DeleteOwner() throws IOException {

    String testID = rachaelId.toHexString();

    // Owner exists before deletion
    assertEquals(1, db.getCollection("owners").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/:id", ImmutableMap.of("id", testID));
    ownerController.deleteOwner(ctx);

    assertEquals(200, mockRes.getStatus());

    // Owner is no longer in the database
    assertEquals(0, db.getCollection("owners").countDocuments(eq("_id", new ObjectId(testID))));
  }

}
