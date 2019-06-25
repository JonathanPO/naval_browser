//GAME CODE

//VARIABLES
var board1 = new Array(10);
for(i=0;i<board1.length;i++){
    //board1[i] = ["", "", "", "", "", "", "", "", "", ""];
    board1[i] = new Array(10);
}

var board2 = new Array(10);
for(i=0;i<board2.length;i++){
    //board2[i] = ["", "", "", "", "", "", "", "", "", ""];
    board2[i] = new Array(10);
}

var boats1 = [];

var boats2 = [];

var cturn = 0;

//FUNCTIONS
function startGame(){
    console.log("INIT");
    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            board1[i][j] = "";
            board2[i][j] = "";
        }
    }

    for(i=1;i<6;i++){
        for(j=0;j<2;j++){
            insertBoat(i, j);
        }
    }
}

function getBoard(b){
    if(b==0){
        return board1;
    }
    return board2;
}

function play(x, y){
    var sym = "*";
    if(hit(x, y)){
        sym = "X";
    }

    if(cturn==0){
        board1[x][y] = sym;
    } else{
        board2[x][y] = sym;
    }
}

function hit(x, y){
    var ret=false;
    var rmv = 0;
    
    if(cturn==0){
        for(i=0;i<boats1.length;i++){
                if(boats1[i][0] == x && boats1[i][1] == y){
                ret = true;
                rmv = i;
                i = boats1.length;
            }
        }

        for(i=rmv;i<boats1.length;i++){
            if((i+1) == boats1.length){
                boats1.length -= 1;
            } else{
                boats1[i] = boats1[i+1];
            }
        }

    } else{
        for(i=0;i<boats2.length;i++){
            if(boats2[i][0] == x && boats2[i][1] == y){
                ret = true;
                i = boats2.length;
            }
        }

        for(i=rmv;i<boats2.length;i++){
            if((i+1) == boats2.length){
                boats2.length -= 1;
            } else{
                boats2[i] = boats2[i+1];
            }
        }

    }

    return ret;
}

function insertBoat(size, b){
    var rx = 0;
    var ry = 0;
    var orientation = rand(0,1);
    var limit = 0;
    var valid=false;

    if(orientation == 0){
        while(!valid){
            rx = rand(0, 9);
            ry = rand(0, 9-size);

            limit = ry + size;

            while(ry < limit){
                valid = isValid(rx, ry, b);
                if(!valid){
                    ry = limit;
                }

                ry++;
            }
        }

        ry = ry - size;

        while(ry < limit){
            if(b == 0){
                boats1.push(new Array(rx, ry));
            } else{
                boats2.push(new Array(rx, ry));
            }

            ry++;
        }
    } else{
        while(!valid){
            rx = rand(0, 9-size);
            ry = rand(0, 9);

            limit = rx + size;

            while(rx < limit){
                valid = isValid(rx, ry, b);
                if(!valid){
                    rx = limit;
                }

                rx++;
            }
        }

        rx = rx - size;

        while(rx < limit){
            if(b == 0){
                boats1.push(new Array(rx, ry));
            } else{
                boats2.push(new Array(rx, ry));
            }

            rx++;
        }
    }

}

function isValid(x, y, b){
    var ret = false;
    var defined = true;

    if (typeof b === "undefined") {
        defined = false;
        ret = true;
    } else{
        if (typeof b[0] === "undefined") {
            defined = false;
            ret = true;
        }
    }

    if(defined){
        if(b == 0){
            for(i=0;i<boats1.length;i++){
                ret = (boats1[i][0] != x && boats1[i][1] != y);
            }
        } else{
            for(i=0;i<boats2.length;i++){
                ret = (boats2[i][0] != x && boats2[i][1] != y);
            }
        }
    }

    return ret;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function changeActiveBoard(){
    if(cturn==0){
        cturn=1;
    } else{
        cturn=0;
    }
}

function whoWin(){
    if(boats1.length===0){
        return 2;
    }

    return 1;
}

//SERVER CODE
var http = require('http');

var server = http.createServer(function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Game start");
});

server.listen(8080, function (){
    console.log("Servidor ouvindo na porta 8080");
});

var WebsocketServer = require('websocket').server;
var wbServer = new WebsocketServer({ httpServer: server});

wbServer.on('request', function (req){
    var websocket = req.accept();
    websocket.send("Hello from Server");

    websocket.on('message', function (message) {
        console.log("Mensagem recebida: ");
        console.log(message);
    });

    var i = 0;
    websocket.send(i++);

    startGame();

    console.log("-------------- B1 -------------");
    console.log(board1);
    console.log(boats1);
    console.log("-------------- B2 -------------");
    console.log(board2);
    console.log(boats2);

    /*console.log("-----------------------");
    console.log(wbServer.connectedUsers);
    console.log(wbServer.connections);*/
});
