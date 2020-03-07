package umm3601.owner;

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
 * Controller that manages requests for info about owners.
 */
public class OwnerController {

  static String emailRegex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$";

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private final MongoCollection<Owner> OwnerCollection;

  /**
   * Construct a controller for owners.
   *
   * @param database the database containing owner data
   */
  public OwnerController(MongoDatabase database) {
    jacksonCodecRegistry.addCodecForClass(Owner.class);
    OwnerCollection = database.getCollection("owners").withDocumentClass(Owner.class)
        .withCodecRegistry(jacksonCodecRegistry);
  }

  /**
   * Get the single owner specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getOwner(Context ctx) {
    String id = ctx.pathParam("id");
    Owner owner;

    try {
      owner = OwnerCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested owner id wasn't a legal Mongo Object ID.");
    }
    if (owner == null) {
      throw new NotFoundResponse("The requested owner was not found");
    } else {
      ctx.json(owner);
    }
  }

  /**
   * Delete the owner specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteOwner(Context ctx) {
    String id = ctx.pathParam("id");
    OwnerCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the owners.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getOwners(Context ctx) {

    List<Bson> filters = new ArrayList<Bson>(); // start with a blank document

    if (ctx.queryParamMap().containsKey("officeID")) {
        filters.add(regex("officeID", ctx.queryParam("officeID")));
    }

    if (ctx.queryParamMap().containsKey("name")) {
      filters.add(regex("name", ctx.queryParam("name"), "i"));
  }

    if (ctx.queryParamMap().containsKey("building")) {
      filters.add(regex("building", ctx.queryParam("building"), "i"));
    }

    String sortBy = ctx.queryParam("sortby", "name"); //Sort by sort query param, default is name
    String sortOrder = ctx.queryParam("sortorder", "asc");

    ctx.json(OwnerCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
      .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the owners.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewOwner(Context ctx) {
    Owner newOwner = ctx.bodyValidator(Owner.class)
      .check((owner) -> owner.name != null && owner.name.length() > 0) //Verify that the owner has a name that is not blank
      .check((owner) -> owner.officeID != null && owner.officeID.length() > 0 ) // Verify that the provided string is not null and length is  is > 0
      .check((owner) -> owner.building != null && owner.building.length() > 0 ) // Verify that the provided string is not null and length is  is > 0
      .check((owner) -> owner.email.matches(emailRegex)) // Verify that the provided email is a valid email
      .get();

    // Generate owner avatar (you won't need this part for todos)
    /*
    try {
      newOwner.avatar = "https://gravatar.com/avatar/" + md5(newOwner.email) + "?d=identicon";  // generate unique md5 code for identicon
    } catch (NoSuchAlgorithmException ignored) {
      newOwner.avatar = "https://gravatar.com/avatar/?d=mp";                           // set to mystery person
    }
    */

    OwnerCollection.insertOne(newOwner);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newOwner._id));
  }

  // /**
  //  * Utility function to generate the md5 hash for a given string
  //  *
  //  * @param str the string to generate a md5 for
  //  */
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
