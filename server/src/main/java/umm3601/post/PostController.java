package umm3601.post;

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
 * Controller that manages requests for info about posts.
 */
public class PostController {

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private final MongoCollection<Post> postCollection;

  /**
   * Construct a controller for posts.
   *
   * @param database the database containing post data
   */
  public PostController(MongoDatabase database) {
    jacksonCodecRegistry.addCodecForClass(Post.class);
    postCollection = database.getCollection("posts").withDocumentClass(Post.class)
        .withCodecRegistry(jacksonCodecRegistry);
  }

  /**
   * Get the single post specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getPost(Context ctx) {
    String id = ctx.pathParam("id");
    Post post;

    try {
      post = postCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested post id wasn't a legal Mongo Object ID.");
    }
    if (post == null) {
      throw new NotFoundResponse("The requested post was not found");
    } else {
      ctx.json(post);
    }
  }

  /**
   * Delete the post specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deletePost(Context ctx) {
    String id = ctx.pathParam("id");
    postCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the posts.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getPosts(Context ctx) {

    List<Bson> filters = new ArrayList<Bson>(); // start with a blank document

    if (ctx.queryParamMap().containsKey("owner")) {
      filters.add(regex("owner", ctx.queryParam("owner"), "i"));
    }

    // if (ctx.queryParamMap().containsKey("message")) {
    //   filters.add(regex("message", ctx.queryParam("message"), "i"));
    // }

    // String sortBy = ctx.queryParam("sortby", "message"); // Sort by sort query param, default is name
    // String sortOrder = ctx.queryParam("sortorder", "asc");

    ctx.json(postCollection.find(filters.isEmpty() ? new Document() : and(filters))
    .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the owners.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewPost(Context ctx) {
    Post newPost = ctx.bodyValidator(Post.class).check((pst) -> pst.owner != null) // Verify that the owner has a name // that is not blank
    .check((pst) -> pst.message != null) // Verify that the provided string is not null and length is is > 0
    .get();
    postCollection.insertOne(newPost);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newPost._id));

  }

  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    String result = "";
    for (byte b : hashInBytes) {
      result += String.format("%02x", b);
    }
    return result;
  }
}
