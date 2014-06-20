package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Lists;
import com.google.inject.Inject;
import dao.RetrospectiveDao;
import filters.ContentType;
import filters.EnsureContentType;
import models.Input;
import models.RealTimeRetrospective;
import models.Retrospective;
import org.bson.types.ObjectId;
import play.mvc.BodyParser;
import play.mvc.Result;
import play.mvc.WebSocket;
import utils.Commons;

import java.io.IOException;
import java.util.Calendar;

public class RetrospectiveController  extends BaseController {
    @Inject
    private RetrospectiveDao retrospectiveDao;

    @EnsureContentType(response = ContentType.JSON)
    public Result getRetrospectives() throws IOException {
        return ok(toJsonString(retrospectiveDao.find()));
    }

    @EnsureContentType(response = ContentType.JSON)
    public Result getRetrospective(String id) throws IOException {
        return ok(retrospectiveDao.findById(new ObjectId(id)).toJson());
    }

    @EnsureContentType(ContentType.JSON)
    @BodyParser.Of(BodyParser.Json.class)
    public Result createRetrospective() throws IOException {
        response().setContentType("application/json");
        Retrospective retro = bindObject(Retrospective.class);
        boolean editing = false;
        if(retro.id == null){
            retro.createdTime = Calendar.getInstance().getTime();
            retro.lastUpdatedTime = Calendar.getInstance().getTime();
        } else {
            retro.lastUpdatedTime = Calendar.getInstance().getTime();
            editing = true;
        }
        retrospectiveDao.save(retro);
        RealTimeRetrospective.newRetro(retro.id.toString());
        if(editing){
            RealTimeRetrospective.newInput(retro.id.toString());
        }
        return ok(retro.id.toString());
    }

    @EnsureContentType(ContentType.JSON)
    @BodyParser.Of(BodyParser.Json.class)
    public Result addInput(String retroId) throws IOException {
        response().setContentType("application/json");
        Input input = bindObject(Input.class);

        Retrospective retro = retrospectiveDao.findById(new ObjectId(retroId));
        if(retro.inputs == null) {
            retro.inputs = Lists.newArrayList();
        }
        retro.inputs.add(input);

        retrospectiveDao.save(retro);
        RealTimeRetrospective.newInput(retro.id.toString());
        return ok(retro.id.toString());
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result removeInput(String retroId, int index) throws IOException {
        response().setContentType("application/json");

        Retrospective retro = retrospectiveDao.findById(new ObjectId(retroId));
        retro.inputs.remove(index);

        retrospectiveDao.save(retro);
        RealTimeRetrospective.newInput(retro.id.toString());
        return ok(retro.id.toString());
    }

    @BodyParser.Of(BodyParser.Json.class)
    public Result addVote(String retroId, int index) throws IOException {
        response().setContentType("application/json");

        Retrospective retro = retrospectiveDao.findById(new ObjectId(retroId));

        retro.inputs.get(index).votes += 1;

        retrospectiveDao.save(retro);
        RealTimeRetrospective.newInput(retro.id.toString());
        return ok(retro.id.toString());
    }

    public WebSocket<JsonNode> getRetrospectiveWS(final String retroId) {
        return new WebSocket<JsonNode>() {

            // Called when the Websocket Handshake is done.
            @Override
            public void onReady(final WebSocket.In<JsonNode> in,
                                final WebSocket.Out<JsonNode> out) {

            try {
                RealTimeRetrospective.register(java.util.UUID.randomUUID().toString(), retroId, Commons.RETRO, in, out);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            }
        };
    }

    public WebSocket<JsonNode> getRetrospectivesWS() {
        return new WebSocket<JsonNode>() {

            // Called when the Websocket Handshake is done.
            @Override
            public void onReady(final WebSocket.In<JsonNode> in,
                                final WebSocket.Out<JsonNode> out) {

                try {
                    RealTimeRetrospective.register(java.util.UUID.randomUUID().toString(), null, Commons.LIST, in, out);
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        };
    }

    /*public WebSocket<JsonNode> index() {
        return new WebSocket<JsonNode>() {

            // Called when the Websocket Handshake is done.
            public void onReady(WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {

                // For each event received on the socket,
                in.onMessage(new F.Callback<JsonNode>() {
                    public void invoke(JsonNode event) {

                        // Log events to the console
                        System.out.println(event);

                    }
                });

                // When the socket is closed.
                in.onClose(new F.Callback0() {
                    public void invoke() {

                        System.out.println("Disconnected");

                    }
                });


                try {
                    out.write(toJsonNode(retrospectiveDao.find()));
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }

        };
    }*/





}
