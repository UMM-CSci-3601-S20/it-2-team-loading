package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;

import umm3601.owner.OwnerController;
import umm3601.note.NoteController;

public class Server {

  static String appName = "CSCI 3601 Announce It!";

  public static final String OWNER_DATA_FILE = "/owners.json";
  public static final String POST_DATA_FILE = "/notes.json";

  private static MongoDatabase database;

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    // Get the database
    database = mongoClient.getDatabase(databaseName);

    // Initialize dependencies
    OwnerController ownerController = new OwnerController(database);
    //OwnerRequestHandler ownerRequestHandler = new OwnerRequestHandler(ownerController);

    NoteController noteController = new NoteController(database);

    Javalin server = Javalin.create().start(4567);

    // Simple example route
    server.get("hello", ctx -> ctx.result("Hello World"));

    // Utility routes
    server.get("api", ctx -> ctx.result(appName));

    // Get specific owner
    // this is wrong, need to fix this later
    server.get("api/owners/:id", ownerController::getOwner);


    server.delete("api/owners/:id", ownerController::deleteOwner);

    // List owners, filtered using query parameters
    server.get("api/owners", ownerController::getOwners);

    // Add new owner
    server.post("api/owners/new", ownerController::addNewOwner);

    //Get all notes from an owner
    // server.get("api/owner/:id/notes", noteController::getOwnerNotes);

    server.delete("api/notes/:id", noteController::deleteNote);

    //List notes with filters
    server.get("api/notes", noteController::getOwnerNotes);

    //Add new note
    //From the owner's doorboard
    server.post("api/owner/:id/notes/new", noteController::addNewNote);



    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
      ctx.json(e); // you probably want to remove this in production
    });
  }
}
