/* English texts for the advent cards.
   ULOHY_EN has exactly the same order as ULOHY in data.js (t = title, x = text, p = materials). */

const KATEGORIE_EN = {
  skutok: 'Good deed', tvorenie: 'Let’s make', kuchyna: 'Baking and cooking', von: 'Outdoors and trips',
  tradicie: 'Christmas traditions', citanie: 'Stories and reading', hudba: 'Songs and dancing',
  hry: 'Games and riddles', rodina: 'Family time', zvieratka: 'Animals and nature',
};

const ULOHY_EN = [
  // ---------- Good deed (14) ----------
  { t:'Good deed', x:'Help set the table for dinner.' },
  { t:'Good deed', x:'Give everyone in your family a Christmas hug and tell them something nice.' },
  { t:'Good deed', x:'Help unpack the shopping and put everything away.' },
  { t:'Good deed', x:{ m:'Pick one toy you no longer play with and give it together to children who need it.', s:'Pick one toy you no longer play with and give it to children who need it.', v:'Go through your toys and books. Pick at least three things that would make someone happy and take them to a donation point.' }, p:'a toy or book to give away' },
  { t:'Good deed', x:'Smile and wish the shop assistant or your teacher a lovely day.' },
  { t:'Secret elf', x:'Do something nice for someone in your family without them knowing it was you.' },
  { t:'Good deed', x:'Tidy up your toys before anyone asks you to.' },
  { t:'Good deed', x:'Take a gingerbread biscuit or a Christmas card to a neighbour as a gift.', p:'gingerbread or a card' },
  { t:'Good deed', x:{ m:'Call Grandma or Grandpa together and sing them a song.', s:'Call Grandma or Grandpa and tell them what you enjoyed today.', v:'Call Grandma or Grandpa and ask what would make them happy this Christmas.' } },
  { t:'Good deed', x:{ m:'Draw a picture for the cook at nursery or for the postman.', s:'Draw a thank-you picture for someone who helps you – the school cook, the bus driver or the postwoman.', v:'Write a thank-you note to someone who helps you all year – your coach, the school cook or the postwoman.' } },
  { t:'Good deed', x:'Do one household job that someone else usually does – hoovering, dusting or hanging out the washing.' },
  { t:'Thank you', x:'Think of 3 things you are grateful for today and share them at dinner.' },
  { t:'Secret note', x:'Write a kind message on a slip of paper and hide it in Mum’s or Dad’s pocket.' },
  { t:'Good deed', x:'Help a younger sibling or a friend with something they find hard – homework, a zip or a building project.' },

  // ---------- Let’s make (13) ----------
  { t:'Paper ornament', x:'Make a paper decoration and hang it on the tree or a Christmas branch.', p:'coloured paper, scissors, glue, thread' },
  { t:'Snowflake', x:{ m:'A grown-up folds the paper and cuts the notches, you unfold the snowflake and stick it on the window.', s:'Cut a snowflake out of folded paper and stick it on the window.', v:'Cut out at least three different snowflakes and decorate the whole window.' }, p:'white paper, scissors' },
  { t:'Christmas card', x:'Draw a Christmas card for a friend.' },
  { t:'Paper chain', x:'Make a chain of paper rings and decorate your room with it.', p:'strips of coloured paper, glue' },
  { t:'My wish', x:'Draw what you would like for Christmas. Your parents will send the picture to Santa.' },
  { t:'Glitter pine cones', x:'Paint pine cones or sprinkle them with glitter and turn them into a Christmas decoration.', p:'pine cones, paint, glitter' },
  { t:'Card for Grandma and Grandpa', x:'Make a Christmas card for your grandparents and post it together.', p:'card, crayons, envelope, stamp' },
  { t:'Wrapping paper', x:'Make your own wrapping paper: print plain paper with a potato stamp.', p:'potato, paint, large paper' },
  { t:'Christmas village', x:'Build a Christmas village from boxes, cardboard or building blocks.' },
  { t:'Paper angel', x:'Make an angel from a paper plate or a paper cone.', p:'paper plate, scissors, crayons' },
  { t:'My own card', x:'Design your own Christmas card and write a short rhyming poem inside.' },
  { t:'Handprint reindeer', x:'Print your hand on paper and turn it into a reindeer or a Christmas tree.', p:'paint, paper' },
  { t:'Candle holder', x:'Decorate a jam jar with paper or paint and turn it into a tealight holder.', p:'jar, glass paint, tealight' },

  // ---------- Baking and cooking (9) ----------
  { t:'Let’s bake gingerbread!', x:'Cut out shapes and put them on the baking tray.', p:'gingerbread dough, cutters' },
  { t:'Decorating gingerbread', x:{ m:'Decorate the gingerbread with icing and sprinkles, any way you like.', s:'Decorate the gingerbread with white icing.', v:'Decorate the gingerbread with icing and invent at least one brand-new pattern.' }, p:'icing, sprinkles' },
  { t:'Christmas biscuits', x:'Bake Christmas biscuits with your parents – jam biscuits, vanilla crescents or coconut macaroons.' },
  { t:'Hot chocolate', x:'Make hot chocolate for the family and serve it with a smile.' },
  { t:'Christmas Eve dinner', x:'Plan the menu for Christmas Eve dinner and draw it like a restaurant menu.' },
  { t:'Fruit tree', x:'Arrange fruit on a plate in the shape of a tree or a snowman and eat it for a snack.', p:'fruit' },
  { t:'Little baker', x:'Read a recipe and measure out all the ingredients for Christmas biscuits on your own.' },
  { t:'Spiced orange', x:'Push cloves into an orange. It will smell lovely all through Advent.', p:'orange, cloves' },
  { t:'Little helper', x:'Help knead the dough for Christmas bread or pizza.' },

  // ---------- Outdoors and trips (8) ----------
  { t:'Day out', x:'Go ice skating or visit a Christmas market.' },
  { t:'Twinkling lights', x:'Take an evening walk and look for the house with the prettiest Christmas lights.' },
  { t:'Snowman', x:'If it has snowed, build a snowman. If not, collect pine cones on a walk.' },
  { t:'Winter walk', x:'Go sledging or take a winter walk in the woods.' },
  { t:'Nature decorations', x:'Collect twigs, pine cones and moss outside for Christmas decorations.' },
  { t:'Library', x:'Visit the library and borrow a Christmas book.' },
  { t:'Town Christmas tree', x:'Go and see the Christmas tree in the town square and take a photo next to it.' },
  { t:'You lead today', x:'Plan a family winter walk on a map and be the guide today.' },

  // ---------- Christmas traditions (13) ----------
  { t:'St Andrew’s Eve', x:'An old custom was pouring melted lead on St Andrew’s Eve. Try pouring candle wax into cold water and guess what the shape looks like.' },
  { t:'St Barbara’s Day', x:'Put a cherry branch in a vase of water. If it blossoms by Christmas, it brings good luck!' },
  { t:'A boot for St Nicholas', x:'Clean and polish your boot and put it on the windowsill for St Nicholas.' },
  { t:'St Nicholas is here!', x:'Learn a short poem or song and perform it for your family.' },
  { t:'St Lucy’s Day', x:'On St Lucy’s Day, corners were traditionally swept with a goose feather. Help tidy one corner of your home.' },
  { t:'The shortest day', x:'Today is the shortest day of the year. Light candles in the evening and talk together by their light.' },
  { t:'Christmas Eve', x:'Help set the festive table and put a carp scale under everyone’s plate for good luck.' },
  { t:'Advent wreath', x:'Make or decorate an Advent wreath with your parents.', p:'wreath, 4 candles, ribbons' },
  { t:'Long ago', x:'Ask Grandma or Grandpa what Christmas was like when they were little.' },
  { t:'Nativity scene', x:'Set up a nativity scene at home and tell everyone who is in it.' },
  { t:'The Christmas story', x:'Read the story of Jesus’ birth together.' },
  { t:'Christmas customs', x:'Find out about Slovak Christmas customs, such as cutting an apple in half or floating walnut-shell boats.' },
  { t:'Trimming the tree', x:'Help decorate the Christmas tree.' },

  // ---------- Stories and reading (6) ----------
  { t:'Candlelit evening', x:'Choose a Christmas story to read before bed.' },
  { t:'Reading aloud', x:'Read a Christmas story aloud to a younger sibling or your parents.' },
  { t:'Our own story', x:'Make up a story together about a snowman who was afraid of winter.' },
  { t:'Family cinema', x:'Watch a Christmas film together – with a blanket and popcorn.' },
  { t:'Letter to Santa', x:'Write a letter to Santa – not just about presents, but also about what went well for you this year.' },
  { t:'Picture hunt', x:'Look at a picture book with a grown-up and find everything Christmassy in the pictures.' },

  // ---------- Songs and dancing (6) ----------
  { t:'Silent Night', x:'Listen to the carol Silent Night and sing at least the beginning with your parents.' },
  { t:'Christmas disco', x:'Dance to Christmas songs with your family.' },
  { t:'A new carol', x:'Learn a new carol and sing it at dinner.' },
  { t:'Jingle shakers', x:'Make a shaker from a small box and buttons and play it along to a carol.', p:'small box, buttons or rice' },
  { t:'Family playlist', x:'Put together a list of 10 Christmas songs the whole family will enjoy.' },
  { t:'Guess the carol', x:'One person hums a tune, everyone else guesses which carol it is.' },

  // ---------- Games and riddles (8) ----------
  { t:'Board game', x:'Play a board game together. The winner chooses tomorrow’s bedtime story.' },
  { t:'Surprise hunt', x:'Your parents have hidden a small surprise. Find it with the “hot or cold” game.', p:'a small surprise to hide' },
  { t:'Blanket fort', x:'Build a fort from blankets and cushions and have a picnic inside.' },
  { t:'Christmas bingo', x:'On a walk, look for: a star, a candle, a Christmas tree, a reindeer and a present.' },
  { t:'Frozen snowman', x:'Dance to Christmas music. When the music stops, freeze like a snowman!' },
  { t:'My riddles', x:'Make up 5 Christmas riddles and let your family guess.' },
  { t:'Memory game', x:'Draw your own Christmas memory cards and play with them.', p:'card, scissors' },
  { t:'Family quiz', x:'Prepare a family Christmas quiz. Everyone thinks of 3 questions for the others.' },

  // ---------- Family time (6) ----------
  { t:'Memories', x:'Look through photos of past Christmases over a cup of cocoa.' },
  { t:'Long time no see', x:'Call someone you haven’t seen for a long time and wish them a lovely Advent.' },
  { t:'What I like about you', x:'At dinner, tell everyone what you like about them.' },
  { t:'Wishes without presents', x:'Write a Christmas wish list together – not things, but experiences.' },
  { t:'Christmas photo', x:'Take a family photo in Christmas jumpers or hats.' },
  { t:'Screen-free evening', x:'A whole evening without TV or phones: games, chatting and tea.' },

  // ---------- Animals and nature (6) ----------
  { t:'Bird feeder', x:'Make a bird feeder from a pine cone, lard and seeds and hang it outside.', p:'pine cone, lard, seeds, string' },
  { t:'Who came to visit?', x:'Put sunflower seeds in the bird feeder and watch who comes.', p:'sunflower seeds' },
  { t:'Birds at the window', x:'Draw all the birds you see from your window today.' },
  { t:'A gift for animals', x:'Take a blanket or pet food to an animal shelter.' },
  { t:'Water for birds', x:'Put a bowl of water outside. In winter, birds have nowhere to drink.' },
  { t:'How animals spend winter', x:'Find out how hedgehogs, bears and migrating birds spend the winter, and tell your family at dinner.' },
];

const SPECIALNE_EN = {
  nedela: { t:'{n} Sunday of Advent', x:'Light the {n} candle on the Advent wreath with your family.' },
  posledna: { t:'The last window!', x:'Follow the map and find the treasure.', p:'treasure map and treasure' },
};
const PORADIE_EN = ['', 'first', 'second', 'third', 'fourth'];

/* same order as HADANKY */
const HADANKY_EN = [
  { q:'I’m white, I grow in winter and I disappear in the sun. What am I?', o:'a snowman' },
  { q:'It falls from the sky but it isn’t rain. It’s white and cold. What is it?', o:'snow' },
  { q:'I have a wick and a light. When you light me, I slowly get smaller.', o:'a candle' },
  { q:'It’s green in summer and in winter, and at Christmas it shines.', o:'a Christmas tree' },
  { q:'It hangs on the tree, it’s round and shiny and it breaks easily.', o:'a bauble' },
  { q:'They bake me, decorate me, and I smell of ginger and cinnamon.', o:'gingerbread' },
  { q:'He comes on the evening of 5 December, has a white beard and brings sweets.', o:'St Nicholas' },
  { q:'I have antlers, I live in the north and I pull a sleigh full of presents.', o:'a reindeer' },
  { q:'The more you take away from it, the bigger it gets. What is it?', o:'a hole' },
  { q:'Which month has 28 days?', o:'all of them' },
  { q:'It belongs to you, but other people use it more than you do.', o:'your name' },
  { q:'It has a neck but no head.', o:'a bottle' },
  { q:'Which is heavier: a kilo of feathers or a kilo of carp?', o:'they weigh the same' },
  { q:'Say my name and I disappear.', o:'silence' },
  { q:'I have keys but I can’t open any doors. You can play carols on me.', o:'a piano' },
  { q:'It goes up and down, yet it never moves.', o:'stairs' },
];

/* same order as VYZVY */
const VYZVY_EN = [
  'Get through the whole day without a single complaint.',
  'Learn to say “Merry Christmas” in three languages.',
  'Work out how many hours are left until Christmas Eve.',
  'Do 20 squats during one carol.',
  'Write a poem using the words snow, present and carp.',
  'Invent a new Christmas tradition for your family.',
  'Find out who brings presents to children in five other countries.',
  'Say only kind things all day – even about your siblings.',
  'Tidy one drawer so well that nobody needs to check it.',
  'Draw a bird’s-eye map of your flat or house.',
];
