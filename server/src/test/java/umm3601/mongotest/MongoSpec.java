package umm3601.mongotest;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 * <p>
 * Note that none of these are actually tests of any of our
 * code; they are mostly demonstrations of the behavior of
 * the MongoDB Java libraries. Thus if they test anything,
 * they test that code, and perhaps our understanding of it.
 * <p>
 * To test "our" code we'd want the tests to confirm that
 * the behavior of methods in things like the OwnerController
 * do the "right" thing.
 * <p>
 * Created by mcphee on 20/2/17.
 */
public class MongoSpec {

  private MongoCollection<Document> ownerDocuments;

  static MongoClient mongoClient;
  static MongoDatabase db;

  @BeforeAll
  public static void setupDB() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void clearAndPopulateDB() {
    ownerDocuments = db.getCollection("owners");
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
    ownerDocuments.insertMany(testOwners);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> owners = new ArrayList<>();
    documents.into(owners);
    return owners;
  }

  private int countOwners(FindIterable<Document> documents) {
    List<Document> owners = intoList(documents);
    return owners.size();
  }

  @Test
  public void shouldBeThreeOwners() {
    FindIterable<Document> documents = ownerDocuments.find();
    int numberOfOwners = countOwners(documents);
    assertEquals(3, numberOfOwners, "Should be 3 total owners");
  }

  @Test
  public void shouldBeOneRachaelJohnson() {
    FindIterable<Document> documents = ownerDocuments.find(eq("name", "Rachael Johnson"));
    int numberOfOwners = countOwners(documents);
    assertEquals(1, numberOfOwners, "Should be 1 Rachael Johnson");
  }

  @Test
  public void shouldBeOneRobertDenton() {
    FindIterable<Document> documents = ownerDocuments.find(eq("name", "Robert Denton"));
    int numberOfOwners = countOwners(documents);
    assertEquals(1, numberOfOwners, "Should be 1 Robert Denton");
  }

  @Test
  public void shouldBeTwoInScienceBuilding() {
    FindIterable<Document> documents = ownerDocuments.find(eq("building", "Science"));
    int numberOfOwners = countOwners(documents);
    assertEquals(2, numberOfOwners, "Should be 2 in the Science building");
  }


  @Test
  public void shouldGetEmilyBruceFromOfficeIDAndBuilding() {
    FindIterable<Document> documents
      = ownerDocuments.find(and(eq("officeID", "1600"),
      eq("building", "Camden")));
    List<Document> docs = intoList(documents);
    assertEquals(1, docs.size(), "Should be 1");
    assertEquals("1600", docs.get(0).get("officeID"), "First should be 1600");
    assertEquals("Camden", docs.get(0).get("building"), "First should be Camden");
  }

  @Test
  public void justNameAndEmail() {
    FindIterable<Document> documents
      = ownerDocuments.find().projection(fields(include("name", "email")));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Rachael Johnson", docs.get(0).get("name"), "First should be Rachael Johnson");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("building"), "First shouldn't have 'building'");
    assertNotNull(docs.get(0).get("_id"), "First should have '_id'");
  }

  @Test
  public void justBuildingAndEmail() {
    FindIterable<Document> documents
      = ownerDocuments.find()
      .projection(fields(include("building", "email"), exclude("_id")));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Science", docs.get(0).get("building"), "First should be Science");
    assertNotNull(docs.get(0).get("email"), "First should have rmjohns@morris.umn.edu");
    assertNull(docs.get(0).get("name"), "First shouldn't have 'Rachael Johnson'");
    assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  }

  // @Test
  // public void justNameAndEmailNoIdSortedByCompany() {
  //   FindIterable<Document> documents
  //     = ownerDocuments.find()
  //     .sort(Sorts.ascending("building"))
  //     .projection(fields(include("name", "email"), excludeId()));
  //   List<Document> docs = intoList(documents);
  //   assertEquals(3, docs.size(), "Should be 3");
  //   assertEquals("Jamie", docs.get(0).get("name"), "First should be Jamie");
  //   assertNotNull(docs.get(0).get("email"), "First should have email");
  //   assertNull(docs.get(0).get("building"), "First shouldn't have 'building'");
  //   assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  // }

  @Test
  public void officeIDCounts() {
    AggregateIterable<Document> documents
      = ownerDocuments.aggregate(
      Arrays.asList(
        /*
         * Groups data by the "officeID" field, and then counts
         * the number of documents with each given officeID.
         * This creates a new "constructed document" that
         * has "officeID" as it's "_id", and the count as the
         * "officeIDCount" field.
         */
        Aggregates.group("$officeID",
          Accumulators.sum("officeIDCount", 1)),
        Aggregates.sort(Sorts.ascending("_id"))
      )
    );
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be two distinct officeIDs");
    assertEquals(docs.get(0).get("_id"), "1310");
    assertEquals(docs.get(0).get("officeIDCount"), 1);
    assertEquals(docs.get(1).get("_id"), "1523");
    assertEquals(docs.get(1).get("officeIDCount"), 1);
  }

  // @Test
  // public void officeID() {
  //   AggregateIterable<Document> documents
  //     = ownerDocuments.aggregate(
  //     Arrays.asList(
  //       Aggregates.group("$building",
  //         Accumulators.avg("officeID", "$officeID")),
  //       Aggregates.sort(Sorts.ascending("_id"))
  //     ));
  //   List<Document> docs = intoList(documents);
  //   assertEquals(3, docs.size(), "Should be three companies");

  //   assertEquals("Frogs, Inc.", docs.get(0).get("_id"));
  //   assertEquals(37.0, docs.get(0).get("officeID"));
  //   assertEquals("IBM", docs.get(1).get("_id"));
  //   assertEquals(37.0, docs.get(1).get("officeID"));
  //   assertEquals("UMM", docs.get(2).get("_id"));
  //   assertEquals(25.0, docs.get(2).get("officeID"));
  // }
}
