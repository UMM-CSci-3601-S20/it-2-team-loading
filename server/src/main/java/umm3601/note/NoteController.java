package umm3601.note;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonCodecRegistry;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about s.
 */
public class NoteController {

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private final MongoCollection<Note> noteCollection;

  /**
   * Construct a controller for notes.
   *
   * @param database the database containing note data
   */
  public NoteController(MongoDatabase database) {
    jacksonCodecRegistry.addCodecForClass(Note.class);
    noteCollection = database.getCollection("notes").withDocumentClass(Note.class)
        .withCodecRegistry(jacksonCodecRegistry);
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
    noteCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the notes.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getOwnerNotes(Context ctx) {

    List<Bson> filters = new ArrayList<Bson>(); // start with a blank document

    if (ctx.queryParamMap().containsKey("owner_id")) {
      filters.add(eq("owner_id", ctx.queryParam("owner_id")));
    }

    ctx.json(noteCollection.find(filters.isEmpty() ? new Document() : and(filters))
    .into(new ArrayList<>()));
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

  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  // public String md5(String str) throws NoSuchAlgorithmException {
  //   MessageDigest md = MessageDigest.getInstance("MD5");
  //   byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

  //   String result = "";
  //   for (byte b : hashInBytes) {
  //     result += String.format("%02x", b);
  //   }
  //   return result;
  // }
}
