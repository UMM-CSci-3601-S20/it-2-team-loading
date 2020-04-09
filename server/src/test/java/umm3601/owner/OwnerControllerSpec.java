package umm3601.owner;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

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
    MongoCollection<Document> ownerDocuments = db.getCollection("owners");
    ownerDocuments.drop();
    List<Document> testOwners = new ArrayList<>();
    testOwners.add(Document.parse("{\n" +
      "                    name: \"Rachael Johnson\",\n" +
      "                    officeID: \"1310\",\n" +
      "                    building: \"Science\",\n" +
      "                    email: \"rmjohns@morris.umn.edu\"\n" +
      "                }"));
    testOwners.add(Document.parse("{\n" +
      "                    name: \"Robert Denton\",\n" +
      "                    officeID: \"1523\",\n" +
      "                    building: \"Science\",\n" +
      "                    email: \"rdenton@morris.umn.edu\"\n" +
      "                }"));
    testOwners.add(Document.parse("{\n" +
      "                    name: \"Emily Bruce\",\n" +
      "                    officeID: \"1600\",\n" +
      "                    building: \"Camden\",\n" +
      "                    email: \"bruce088@morris.umn.edu\"\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("name", "Sam")
      .append("officeID", "1300")
      .append("building", "Spooky")
      .append("email", "sam@frogs.com");


    ownerDocuments.insertMany(testOwners);
    ownerDocuments.insertOne(Document.parse(sam.toJson()));

    ownerController = new OwnerController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllOwners() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);


    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    System.out.println(db.getCollection("owners").countDocuments());
    assertEquals(db.getCollection("owners").countDocuments(), JavalinJson.fromJson(result, Owner[].class).length); // 3 owners in testing database
  }

  @Test
  public void GetOwnersByOfficeID() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("officeID=1600");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");

    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();
    Owner[] resultOwners = JavalinJson.fromJson(result, Owner[].class);

    assertEquals(1, resultOwners.length); // There should be two owners returned
    for (Owner owner : resultOwners) {
      assertEquals("1600", owner.officeID); // Every owner should be officeID 37
    }
  }

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
  public void GetOwnersByName() throws IOException {

    mockReq.setQueryString("name=Rachael Johnson");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    for (Owner owner : JavalinJson.fromJson(result, Owner[].class)) {
      assertEquals("Rachael Johnson", owner.name);
    }
  }

  @Test
  public void GetOwnersByBuildingAndOfficeID() throws IOException {

    mockReq.setQueryString("building=Science&officeID=1310");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners");
    ownerController.getOwners(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    Owner[] resultOwners = JavalinJson.fromJson(result, Owner[].class);

    assertEquals(1, resultOwners.length); // There should be one owner returned
    for (Owner owner : resultOwners) {
       assertEquals("Science", owner.building);
       assertEquals("1310", owner.officeID);
     }
  }

  @Test
  public void GetOwnerWithExistentId() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/:id", ImmutableMap.of("id", testID));
    ownerController.getOwner(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Owner resultOwner = JavalinJson.fromJson(result, Owner.class);

    assertEquals(resultOwner._id, samsId.toHexString());
    assertEquals(resultOwner.name, "Sam");
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

    String testNewOwner = "{\n\t\"name\": \"Alien\",\n\t\"officeID\": \"1524\",\n\t\"building\": \"Mars\",\n\t\"email\": \"coolguy@gmail.com\"\n}";

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
    assertEquals("Alien", addedOwner.getString("name"));
    assertEquals("1524", addedOwner.getString("officeID"));
    assertEquals("Mars", addedOwner.getString("building"));
    assertEquals("coolguy@gmail.com", addedOwner.getString("email"));
  }

  @Test
  public void AddInvalidEmailOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": \"Alien\",\n\t\"officeID\": \"1524\",\n\t\"building\": \"Mars\",\n\t\"email\": \"coolguygmail.com\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  // Check that adding an Owner throws a bad request response when officeId is null
  @Test
  public void AddInvalidOfficeIDOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": \"Alien\",\n\t\"officeID\": \"\",\n\t\"building\": \"Mars\",\n\t\"email\": \"coolguy@gmail.com\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  // Check that adding an Owner throws a bad request response when name is null
  @Test
  public void AddInvalidNameOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": ,\n\t\"officeID\": \"1524\",\n\t\"building\": \"Mars\",\n\t\"email\": \"coolguy@gmail.com\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }

  // Check that adding an Owner throws a bad request response when building is null
  @Test
  public void AddInvalidBuildingOwner() throws IOException {
    String testNewOwner = "{\n\t\"name\": \"Alien\",\n\t\"officeID\":,\n\t\"building\": \"\",\n\t\"email\": \"coolguy@gmail.com\"\n}";
    mockReq.setBodyContent(testNewOwner);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/new");

    assertThrows(BadRequestResponse.class, () -> {
      ownerController.addNewOwner(ctx);
    });
  }




  @Test
  public void DeleteOwner() throws IOException {

    String testID = samsId.toHexString();

    // Sam exists in the database before we delete him
    assertEquals(1, db.getCollection("owners").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owners/:id", ImmutableMap.of("id", testID));
    ownerController.deleteOwner(ctx);

    assertEquals(200, mockRes.getStatus());

    // Owner is no longer in the database
    assertEquals(0, db.getCollection("owners").countDocuments(eq("_id", new ObjectId(testID))));
  }

}
