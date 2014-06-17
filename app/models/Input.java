package models;

public class Input extends BaseEntity{
    public String description;
    public int votes;
    public InputType type;

    public Input(){
        this.votes = 0;
    }
}
