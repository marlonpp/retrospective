package models;


import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.UntypedActor;
import com.fasterxml.jackson.databind.JsonNode;
import dao.RetrospectiveDao;
import mapper.CustomObjectMapper;
import modules.AppInjector;
import org.bson.types.ObjectId;
import play.Logger;
import play.libs.Akka;
import play.libs.F;
import play.mvc.WebSocket;
import utils.Commons;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class RealTimeRetrospective extends UntypedActor{

    private RetrospectiveDao retrospectiveDao = AppInjector.getInstance(RetrospectiveDao.class);

    protected static final CustomObjectMapper mapper = new CustomObjectMapper();

    static ActorRef actor = Akka.system().actorOf(new Props(RealTimeRetrospective.class));

    Map<String, WebSocket.Out<JsonNode>> registeredList = new HashMap<String, WebSocket.Out<JsonNode>>();
    Map<String, Map<String, WebSocket.Out<JsonNode>>> registered = new HashMap<String, Map<String, WebSocket.Out<JsonNode>>>();

    public static void register(final String id, final String retroId, final int type,
                                final WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out)
            throws Exception {

        actor.tell(new RegistrationMessage(id, retroId,type, out), null);

        // For each event received on the socket,
        in.onMessage(new F.Callback<JsonNode>() {
            @Override
            public void invoke(JsonNode event) {
                // nothing to do
            }
        });

        // When the socket is closed.
        in.onClose(new F.Callback0() {
            @Override
            public void invoke() {
                actor.tell(new UnregistrationMessage(id, retroId, type), null);
            }
        });
    }

    public static void newRetro(String id) {

        actor.tell(new RetroMessage(id, Commons.LIST), null);

    }

    public static void newInput(String id) {

        actor.tell(new RetroMessage(id, Commons.RETRO), null);

    }


    @Override
    public void onReceive(Object message) {
        Logger.info("Message Received ==> " + message.toString() + " - type ==>");
        if (message instanceof RegistrationMessage) {

            // Received a Join message
            RegistrationMessage registration = (RegistrationMessage) message;
            Logger.info("Registering " + registration.id);
            if(registration.type == Commons.LIST) {
                registeredList.put(registration.id, registration.channel);
                JsonNode retrospectives = mapper.valueToTree(retrospectiveDao.find());
                registration.channel.write(retrospectives);
            } else{
                Map<String, WebSocket.Out<JsonNode>> tempMap = registered.get(registration.retroId);
                if(tempMap == null){
                    tempMap = new HashMap<String, WebSocket.Out<JsonNode>>();
                    tempMap.put(registration.id, registration.channel);
                    registered.put(registration.retroId, tempMap);
                } else{
                    registered.get(registration.retroId).put(registration.id, registration.channel);
                }


                try {
                    JsonNode retro = retrospectiveDao.findById(new ObjectId(registration.retroId)).toJson();
                    registration.channel.write(retro);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }


        } else if (message instanceof RetroMessage) {

            RetroMessage retroMessage = (RetroMessage) message;
            JsonNode retrospective;
            try {
                Thread.sleep(200);
                retrospective = retrospectiveDao.findById(new ObjectId(retroMessage.id)).toJson();
                if(retroMessage.type == Commons.LIST) {
                    for (WebSocket.Out<JsonNode> channel : registeredList.values()) {
                        channel.write(retrospective);
                    }
                } else{
                    for (WebSocket.Out<JsonNode> channel : registered.get(retroMessage.id).values()) {
                        channel.write(retrospective);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }


        } else if (message instanceof UnregistrationMessage) {

            // Received a Unregistration message
            UnregistrationMessage quit = (UnregistrationMessage) message;

            Logger.info("Unregistering " + quit.id + "...");
            if(quit.type == Commons.LIST) {
                registeredList.remove(quit.id);
            } else {
                registered.get(quit.retroId).remove(quit.id);
            }

        } else {
            unhandled(message);
        }

    }

    public static class RegistrationMessage {
        String id;
        String retroId;
        int type;
        WebSocket.Out<JsonNode> channel;

        public RegistrationMessage(String id, String retroId, int type, WebSocket.Out<JsonNode> channel) {
            super();
            this.id = id;
            this.retroId = retroId;
            this.channel = channel;
            this.type = type;
        }
    }

    public static class UnregistrationMessage {
        String id;
        String retroId;
        int type;

        public UnregistrationMessage(String id, String retroId, int type) {
            super();
            this.id = id;
            this.retroId = retroId;
            this.type = type;
        }
    }

    public static class RetroMessage {

        String id;
        int type;

        RetroMessage(String id, int type) {
            this.id = id;
            this.type = type;

        }

    }
}
