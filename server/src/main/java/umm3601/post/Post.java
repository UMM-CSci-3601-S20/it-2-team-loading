package umm3601.post;

import org.mongojack.Id;
import org.mongojack.ObjectId;
//import umm3601.owner.Owner;

public class Post {

  @ObjectId @Id
  public String _id;
  
  public String message;
  public String  owner;
}
