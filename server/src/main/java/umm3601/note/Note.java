package umm3601.note;

import java.util.Date;

import org.mongojack.Id;
import org.mongojack.ObjectId;
//import umm3601.owner.Owner;

public class Note {

  @ObjectId @Id
  public String _id;
  public String owner_id;
  public String message;
  public Boolean timestamp;
}
