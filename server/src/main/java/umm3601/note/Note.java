package umm3601.note;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Note {

  @ObjectId @Id
  public String _id;
  public String owner_id;
  public String message;
  public String expiration;
  public String timestamp;
}
