package models;

import java.util.ArrayList;
import java.util.List;

public enum InputType {

    START, CONTINUE, STOP, SHOUTOUT;

    public static List<InputType> parse(String... stacks) {
        List<InputType> stacksList = new ArrayList<InputType>();

        for (String currentStack : stacks) {
            InputType stack = InputType.valueOf(currentStack.toUpperCase());

            if (stack != null) {
                stacksList.add(stack);
            }
        }
        return stacksList;
    }


}
