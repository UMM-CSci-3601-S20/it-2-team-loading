package umm3601.note;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import java.util.List;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonCodecRegistry;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import java.time.Instant;

/**
 * Controller that manages requests for info about s.
 */
public class NoteController {

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private final MongoCollection<Note> noteCollection;
  private long currentDateTime;

  /**
   * Construct a controller for notes.
   *
   * @param database the database containing note data
   */
  public NoteController(MongoDatabase database) {
    jacksonCodecRegistry.addCodecForClass(Note.class);
    noteCollection = database.getCollection("notes").withDocumentClass(Note.class)
        .withCodecRegistry(jacksonCodecRegistry);
    currentDateTime = Instant.now().toEpochMilli();
  }

  /**
   * Get the single note specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getNote(Context ctx) {
    String id = ctx.pathParam("id");
    Note note;

    try {
      note = noteCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested note id wasn't a legal Mongo Object ID.");
    }
    if (note == null) {
      throw new NotFoundResponse("The requested note was not found");
    } else {
      ctx.json(note);
    }
  }

  /**
   * Delete the note specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteNote(Context ctx) {
    String id = ctx.pathParam("id");
    System.out.println("SERVER CALLED: " + id);
    noteCollection.deleteOne(eq("_id", new ObjectId(id)));
    System.out.println("NOTE DELTED");
  }

  private void filterExpiredNotes(List<Note> notes){
    for(int i = 0; i < notes.size(); i++){ // running through each index of the array
      if(notes.get(i).expiration != null){ // makeing sure the expiration date exists
      long testExpire = Instant.parse(notes.get(i).expiration).toEpochMilli();
      currentDateTime = Instant.now().toEpochMilli();

      if(checkIfExpired(testExpire) ){
        String removeID = notes.get(i)._id;
        System.out.println(notes.get(i).message + " is expired");
        noteCollection.deleteOne(eq("_id",new ObjectId(removeID)));
        }
      }
    }
  }


  /**
   * Get a JSON response with a list of all the notes.
   * @param ctx a Javalin HTTP context
   */
  public void getOwnerNotes(Context ctx) {
    List<Bson> filters = new ArrayList<Bson>(); // start with a blank document

    if (ctx.queryParamMap().containsKey("owner_id")) {//
      filters.add(eq("owner_id", ctx.queryParam("owner_id")));// gathering the owner id
      List<Note> notes = noteCollection.find(and(filters)).into(new ArrayList<>()); // creating an Array List of notes from database
      // from a specific owner id
      filterExpiredNotes(notes); // filtering out and deleting expired notes
    }
    ctx.json(noteCollection.find(filters.isEmpty() ? new Document() : and(filters))
    .into(new ArrayList<>()));
  }

  private boolean checkIfExpired(Long expiredDate){
    if(expiredDate != null){
    if(currentDateTime >= expiredDate){
      return true;
    }}
    return false;
  }

  /**
   * Get a JSON response with a list of all the owners.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewNote(Context ctx) {
    System.out.println("METHOD IS CALLED!!");
    Note newNote = ctx.bodyValidator(Note.class)
    .check((pst) -> pst.message != null) // note should have a message
    .check((pst) -> pst.owner_id != null) // note should have an owner_id
    .get();
    System.out.println("INSERTING");
    noteCollection.insertOne(newNote);
    System.out.println("INSERTED");
    ctx.status(201);
    System.out.println("status");
    ctx.json(ImmutableMap.of("id", newNote._id));
  }

}
