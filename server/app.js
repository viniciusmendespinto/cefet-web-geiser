let express = require('express'),
    app = express();

app.use(express.static('client/'));

app.listen(3000, function () {
  console.log('Servidor escutando!');
});

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))

let fs = require('fs');
_ = require('underscore'),
let db = {
	jogadores: JSON.parse(fs.readFileSync(__dirname + '/data/jogadores.json')),
    jogosPorJogador: JSON.parse(fs.readFileSync(__dirname + '/data/jogosPorJogador.json'))
};

app.set('view engine', 'hbs');

app.set('views', 'server/views');

app.get('/', function (req, res) {
  res.render('index', db.jogadores);
});


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

// abrir servidor na porta 3000
// dica: 1-3 linhas de código

app.get('/jogador/:id/', function(req, res) {
  let perfil = _.find(db.jogadores.players, function(el) { 
  	     return el.steamid === req.params.id;
  	  });
  let jogos = db.jogosPorJogador[req.params.id];

  jogos.not_played_count = _.where(jogos.games, { playtime_forever: 0 }).length;
  jogos.games = _.sortBy(jogos.games, function(el) {
    return -el.playtime_forever;
  });
  jogos.games = _.head(jogos.games, 5);
  jogos.games = _.map(jogos.games, function(el) {
    el.playtime_forever_h = Math.round(el.playtime_forever/60);
    return el;
  });

  res.render('jogador', {
    profile: perfil,
    gameInfo: jogos,
    favorito: jogos.games[0]
  });
});


