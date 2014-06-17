package models;

import play.data.validation.Constraints.Required;

import java.util.List;

public class Retrospective extends BaseEntity {

    @Required(message="required.retrospective.description")
    public String description;

    public List<Input> inputs;
    public boolean isClosed = false;

}
