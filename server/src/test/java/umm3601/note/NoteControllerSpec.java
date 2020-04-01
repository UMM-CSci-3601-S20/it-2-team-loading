package umm3601.note;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
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
import org.jetbrains.annotations.NotNull;
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
public class NoteControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private NoteController noteController;

  private ObjectId samsId;
  private Timestamp timestamp;
  private Date date;



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

    // Set timestamp toString
    date = new Date();
    timestamp = new Timestamp(date.getTime());
    String sTimestamp = timestamp.toString();

        // Setup database
    MongoCollection<Document> noteDocuments = db.getCollection("notes");
    noteDocuments.drop();
    List<Document> testNotes = new ArrayList<>();
    testNotes.add(Document.parse("{\n" +
      "                    message: \"I wanna say something,\",\n" +
      "                    owner_id: \"1310\",\n" +
      "                    timestamp : \"2020-03-26 00:47:34.386\",\n" +
      "                }"));
    testNotes.add(Document.parse("{\n" +
      "                    message: \"But we're leaving\",\n" +
      "                    owner_id: \"1523\",\n" +
      "                    timestamp : \"2020-03-26 00:47:34.386\",\n" +
      "                }"));
    testNotes.add(Document.parse("{\n" +
      "                    message: \"And it's over\",\n" +
      "                    owner_id: \"1600\",\n" +
      "                    timestamp : \"2020-03-26 00:47:34.386\",\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("message", "Sam's message")
      .append("owner_id", "1300")
      .append("timestamp", "2017-01-23T16:46:07.812Z");


    // noteDocuments.insertMany(testNotes);
    noteDocuments.insertOne(Document.parse(sam.toJson()));

    noteController = new NoteController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }


  @Test
  public void GetNotesByOwner_id() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("owner_id=1300");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes");

    noteController.getOwnerNotes(ctx);

    String result = ctx.resultString();

    Note[] resultNotes = JavalinJson.fromJson(result, Note[].class);
    for (Note note : resultNotes) {
      System.out.println(note);
    }


    assertEquals(1, resultNotes.length); // There should be one owner returned
    for (Note note : resultNotes) {
      assertEquals("1300", note.owner_id); // There should be one with that id
    }
  }

  @Test
  public void AddNote() throws IOException {

    String testNewNote = "{\n\t\"message\": \"Alien\",\n\t\"owner_id\": \"coolguyid\",\n"
     + "\t\"timestamp\": ISODate(\"2017-01-23T16:46:07.812Z\")\n}";
    System.out.println(testNewNote);

    mockReq.setBodyContent(testNewNote);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/owner:id/notes/new");

    noteController.addNewNote(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();

    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(id))));

    //verify owner was added to the database and the correct ID
    Document addedNote = db.getCollection("notes").find(eq("_id", new ObjectId(id))).first();
    System.out.println(addedNote.toString());
    assertNotNull(addedNote);
    assertEquals("Alien", addedNote.getString("message"));
    assertEquals("new Date",addedNote.getString("timestamp"));
  }

  @Test
  public void DeleteNote() throws IOException {

    String testID = samsId.toHexString();

    // Sam exists in the database before we delete him
    assertEquals(1, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes", ImmutableMap.of("id", testID));
    noteController.deleteNote(ctx);

    assertEquals(200, mockRes.getStatus());

    // Owner is no longer in the database
    assertEquals(0, db.getCollection("notes").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  public void getNote() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/notes/:id", ImmutableMap.of("id", testID));
    noteController.getNote(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Note resultNote = JavalinJson.fromJson(result, Note.class);
    String resultTimeStamp = resultNote.timestamp.toString();
    System.out.println(resultTimeStamp);

    assertEquals(resultNote._id, samsId.toHexString());
    assertEquals(resultNote.owner_id, "1300");
    assertNotEquals(resultNote.timestamp, null);
    assertEquals(resultNote.timestamp.toString(), resultTimeStamp);
  }

}
