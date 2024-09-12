import express,{Request, Response, request, response} from "express";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (request:Request, response: Response) {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            response.render("index", data);
        });
});

app.get("/:pokemon", function(request:Request, response:Response){
    fetch(`https://pokeapi.co/api/v2/pokemon/${request.params.pokemon}`)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        data.name=data.name.charAt(0).toUpperCase()+data.name.slice(1);
        data.abilities.forEach(function(ability){
            ability.ability.name=ability.ability.name.charAt(0).toUpperCase()+ability.ability.name.slice(1);
        })
        data.types.forEach(function(type){
            type.type.name=type.type.name.charAt(0).toUpperCase()+type.type.name.slice(1);
        })
        response.render("pokemon", data);
    })
    .catch(error=>{
        console.error("erro ao buscar dados:", error);
        response.status(500).send('erro ao buscar dados de pokemon');
    });
})

app.listen(3000, function () {
    console.log("Server is running");
})