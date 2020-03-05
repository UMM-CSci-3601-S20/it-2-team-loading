package umm3601.owner;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Owner {

  @ObjectId @Id
  public String _id;
  public String name;
  public String officeID;
  public String email;
  public String building;

}
