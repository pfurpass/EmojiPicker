/**
 * EmojiPicker.js — Flexible JavaScript Emoji Picker Library
 * 
 * Usage:
 *   const picker = new EmojiPicker({ container: '#btn', theme: 'auto' })
 *   picker.on('emojiClick', (emoji) => console.log(emoji.char))
 *
 * Events: emojiClick, emojiHover, pickerOpen, pickerClose, categoryChange, search
 * Methods: open(), close(), toggle(), destroy(), setTheme(theme)
 * Static:  EmojiPicker.attachToInput(selector, opts)
 */

// NACHHER (UMD — Browser + CommonJS + AMD)
(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS / Node.js / npm
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD (RequireJS)
    define([], factory);
  } else {
    // Browser global
    root.EmojiPicker = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';


/* ===========================
   EMOJI DATA
   =========================== */
const EMOJI_DATA = {
  "Smileys & Emotion": [
    { char:"😀", name:"grinning_face", kw:["happy","smile","grin"] },
    { char:"😃", name:"grinning_face_big_eyes", kw:["happy","smile"] },
    { char:"😄", name:"grinning_face_smiling_eyes", kw:["happy","laugh"] },
    { char:"😁", name:"beaming_face", kw:["smile","grin","happy"] },
    { char:"😆", name:"grinning_squinting_face", kw:["laugh","lol","haha"] },
    { char:"😅", name:"grinning_face_sweat", kw:["sweat","nervous","relief"] },
    { char:"🤣", name:"rolling_on_floor_laughing", kw:["rofl","laugh","lol","haha"] },
    { char:"😂", name:"face_with_tears_of_joy", kw:["lol","laugh","haha","joy","tears"] },
    { char:"🙂", name:"slightly_smiling_face", kw:["smile","happy"] },
    { char:"🙃", name:"upside_down_face", kw:["silly","sarcasm","flip"] },
    { char:"😉", name:"winking_face", kw:["wink","flirt"] },
    { char:"😊", name:"smiling_face_with_smiling_eyes", kw:["blush","happy","sweet"] },
    { char:"😇", name:"smiling_face_with_halo", kw:["angel","innocent","halo"] },
    { char:"🥰", name:"smiling_face_hearts", kw:["love","hearts","adore"] },
    { char:"😍", name:"smiling_face_heart_eyes", kw:["love","heart","adore","crush"] },
    { char:"🤩", name:"star_struck", kw:["wow","excited","star","amazing"] },
    { char:"😘", name:"face_blowing_a_kiss", kw:["kiss","love","mwah"] },
    { char:"😗", name:"kissing_face", kw:["kiss"] },
    { char:"😚", name:"kissing_face_closed_eyes", kw:["kiss","love"] },
    { char:"😙", name:"kissing_face_smiling_eyes", kw:["kiss","smile"] },
    { char:"🥲", name:"smiling_face_with_tear", kw:["cry","happy","bittersweet"] },
    { char:"😋", name:"face_savoring_food", kw:["yum","food","delicious"] },
    { char:"😛", name:"face_with_tongue", kw:["tongue","playful"] },
    { char:"😜", name:"winking_face_tongue", kw:["tongue","wink","playful"] },
    { char:"🤪", name:"zany_face", kw:["crazy","silly","wild"] },
    { char:"😝", name:"squinting_face_tongue", kw:["tongue","playful"] },
    { char:"🤑", name:"money_mouth_face", kw:["money","rich","cash"] },
    { char:"🤗", name:"hugging_face", kw:["hug","warm","hug"] },
    { char:"🤭", name:"face_with_hand_over_mouth", kw:["oops","secret","giggle"] },
    { char:"🤫", name:"shushing_face", kw:["quiet","secret","shush"] },
    { char:"🤔", name:"thinking_face", kw:["think","hmm","wondering"] },
    { char:"🤐", name:"zipper_mouth_face", kw:["secret","zip","quiet"] },
    { char:"🤨", name:"face_raised_eyebrow", kw:["doubt","skeptical","suspicious"] },
    { char:"😐", name:"neutral_face", kw:["neutral","meh","blank"] },
    { char:"😑", name:"expressionless_face", kw:["blank","neutral","meh"] },
    { char:"😶", name:"face_without_mouth", kw:["silent","quiet","no_mouth"] },
    { char:"😏", name:"smirking_face", kw:["smirk","smug","flirt"] },
    { char:"😒", name:"unamused_face", kw:["meh","unimpressed","bored"] },
    { char:"🙄", name:"face_rolling_eyes", kw:["eyeroll","whatever","bored"] },
    { char:"😬", name:"grimacing_face", kw:["grimace","awkward","oops"] },
    { char:"🤥", name:"lying_face", kw:["lie","pinocchio","liar"] },
    { char:"😌", name:"relieved_face", kw:["relief","calm","peaceful"] },
    { char:"😔", name:"pensive_face", kw:["sad","pensive","thoughtful"] },
    { char:"😪", name:"sleepy_face", kw:["sleepy","tired","drool"] },
    { char:"🤤", name:"drooling_face", kw:["drool","food","delicious"] },
    { char:"😴", name:"sleeping_face", kw:["sleep","zzz","tired"] },
    { char:"😷", name:"face_with_medical_mask", kw:["sick","mask","ill","covid"] },
    { char:"🤒", name:"face_with_thermometer", kw:["sick","ill","fever"] },
    { char:"🤕", name:"face_with_head_bandage", kw:["hurt","injured","bandage"] },
    { char:"🤢", name:"nauseated_face", kw:["sick","nausea","gross"] },
    { char:"🤮", name:"face_vomiting", kw:["vomit","sick","gross","disgusting"] },
    { char:"🤧", name:"sneezing_face", kw:["sneeze","sick","cold","gesundheit"] },
    { char:"🥵", name:"hot_face", kw:["hot","heat","fire","sweating"] },
    { char:"🥶", name:"cold_face", kw:["cold","freezing","ice","brr"] },
    { char:"🥴", name:"woozy_face", kw:["drunk","dizzy","woozy"] },
    { char:"😵", name:"dizzy_face", kw:["dizzy","spiral","confused"] },
    { char:"🤯", name:"exploding_head", kw:["mindblown","wow","explode","shocked"] },
    { char:"😎", name:"smiling_face_with_sunglasses", kw:["cool","sunglasses","awesome"] },
    { char:"🥸", name:"disguised_face", kw:["disguise","fake","incognito"] },
    { char:"🤓", name:"nerd_face", kw:["nerd","glasses","geek"] },
    { char:"🧐", name:"face_with_monocle", kw:["monocle","fancy","inspect"] },
    { char:"😕", name:"confused_face", kw:["confused","puzzled","what"] },
    { char:"😟", name:"worried_face", kw:["worried","concerned","sad"] },
    { char:"🙁", name:"slightly_frowning_face", kw:["sad","frown","unhappy"] },
    { char:"😮", name:"face_open_mouth", kw:["surprised","wow","shocked"] },
    { char:"😯", name:"hushed_face", kw:["surprised","speechless","hushed"] },
    { char:"😲", name:"astonished_face", kw:["astonished","shocked","wow"] },
    { char:"😳", name:"flushed_face", kw:["flushed","embarrassed","blush"] },
    { char:"🥺", name:"pleading_face", kw:["pleading","puppy","eyes","please"] },
    { char:"😦", name:"frowning_face_open_mouth", kw:["frown","surprised","concern"] },
    { char:"😧", name:"anguished_face", kw:["anguish","hurt","pain"] },
    { char:"😨", name:"fearful_face", kw:["fear","scared","fearful"] },
    { char:"😰", name:"anxious_face_sweat", kw:["anxious","worried","stress"] },
    { char:"😥", name:"sad_but_relieved_face", kw:["sad","relieved","whew"] },
    { char:"😢", name:"crying_face", kw:["cry","sad","tears"] },
    { char:"😭", name:"loudly_crying_face", kw:["crying","sob","tears","sad"] },
    { char:"😱", name:"face_screaming_in_fear", kw:["scream","scared","horror","munch"] },
    { char:"😖", name:"confounded_face", kw:["confounded","groan","frustrated"] },
    { char:"😣", name:"persevering_face", kw:["persevere","struggle","fight"] },
    { char:"😞", name:"disappointed_face", kw:["disappointed","sad","letdown"] },
    { char:"😓", name:"downcast_face_sweat", kw:["sweat","hard_work","sigh"] },
    { char:"😩", name:"weary_face", kw:["weary","tired","frustrated"] },
    { char:"😫", name:"tired_face", kw:["tired","exhausted","weary"] },
    { char:"🥱", name:"yawning_face", kw:["yawn","tired","bored"] },
    { char:"😤", name:"face_with_steam", kw:["triumph","steam","anger","frustrated"] },
    { char:"😡", name:"pouting_face", kw:["angry","mad","furious","rage"] },
    { char:"😠", name:"angry_face", kw:["angry","mad","grumpy"] },
    { char:"🤬", name:"face_symbols_mouth", kw:["cursing","angry","swear"] },
    { char:"😈", name:"smiling_face_with_horns", kw:["devil","evil","mischief"] },
    { char:"👿", name:"angry_face_with_horns", kw:["devil","angry","evil"] },
    { char:"💀", name:"skull", kw:["skull","death","dead","skeleton"] },
    { char:"☠️", name:"skull_crossbones", kw:["skull","death","poison"] },
    { char:"💩", name:"pile_of_poo", kw:["poop","crap","shit","poo"] },
    { char:"🤡", name:"clown_face", kw:["clown","circus","silly"] },
    { char:"👹", name:"ogre", kw:["monster","ogre","devil"] },
    { char:"👺", name:"goblin", kw:["goblin","demon","evil"] },
    { char:"👻", name:"ghost", kw:["ghost","spooky","halloween","boo"] },
    { char:"👽", name:"alien", kw:["alien","ufo","extraterrestrial"] },
    { char:"👾", name:"alien_monster", kw:["alien","monster","game","pixel"] },
    { char:"🤖", name:"robot", kw:["robot","bot","ai","machine"] },
    { char:"😺", name:"grinning_cat", kw:["cat","smile","happy"] },
    { char:"😸", name:"grinning_cat_smiling_eyes", kw:["cat","happy","smile"] },
    { char:"😹", name:"cat_joy", kw:["cat","lol","laugh"] },
    { char:"😻", name:"smiling_cat_heart_eyes", kw:["cat","love","heart"] },
    { char:"😼", name:"cat_wry_smile", kw:["cat","smirk"] },
    { char:"😽", name:"kissing_cat", kw:["cat","kiss"] },
    { char:"🙀", name:"weary_cat", kw:["cat","shocked","weary"] },
    { char:"😿", name:"crying_cat", kw:["cat","sad","cry"] },
    { char:"😾", name:"pouting_cat", kw:["cat","angry","grumpy"] },
    { char:"💋", name:"kiss_mark", kw:["kiss","lips","love"] },
    { char:"💌", name:"love_letter", kw:["love","letter","heart","mail"] },
    { char:"💔", name:"broken_heart", kw:["broken","heart","sad","love"] },
    { char:"❤️", name:"red_heart", kw:["heart","love","red"] },
    { char:"🧡", name:"orange_heart", kw:["heart","orange","love"] },
    { char:"💛", name:"yellow_heart", kw:["heart","yellow","love"] },
    { char:"💚", name:"green_heart", kw:["heart","green","love","nature"] },
    { char:"💙", name:"blue_heart", kw:["heart","blue","love"] },
    { char:"💜", name:"purple_heart", kw:["heart","purple","love"] },
    { char:"🖤", name:"black_heart", kw:["heart","black","dark"] },
    { char:"🤍", name:"white_heart", kw:["heart","white","pure"] },
    { char:"🤎", name:"brown_heart", kw:["heart","brown"] },
    { char:"💯", name:"hundred_points", kw:["100","perfect","score","hundred"] },
    { char:"💢", name:"anger_symbol", kw:["anger","mad","comic"] },
    { char:"💥", name:"collision", kw:["boom","explosion","impact"] },
    { char:"💫", name:"dizzy", kw:["star","dizzy","spin"] },
    { char:"💦", name:"sweat_droplets", kw:["sweat","water","drops"] },
    { char:"💨", name:"dashing_away", kw:["wind","fast","run"] },
    { char:"🕳️", name:"hole", kw:["hole","dark","empty"] },
    { char:"💬", name:"speech_balloon", kw:["chat","speech","talk","message"] },
    { char:"💭", name:"thought_balloon", kw:["thought","think","cloud"] },
    { char:"🗨️", name:"left_speech_bubble", kw:["speech","chat","dialog"] },
    { char:"💤", name:"zzz", kw:["sleep","tired","zzz"] }
  ],
  "People & Body": [
    { char:"👋", name:"waving_hand", kw:["wave","hello","hi","bye"], skinnable:true },
    { char:"🤚", name:"raised_back_of_hand", kw:["hand","raise","stop"], skinnable:true },
    { char:"🖐️", name:"hand_fingers_splayed", kw:["hand","five","fingers"], skinnable:true },
    { char:"✋", name:"raised_hand", kw:["hand","stop","high_five"], skinnable:true },
    { char:"🖖", name:"vulcan_salute", kw:["spock","live_long","prosper","star_trek"], skinnable:true },
    { char:"👌", name:"ok_hand", kw:["ok","agree","perfect","finger"], skinnable:true },
    { char:"🤌", name:"pinched_fingers", kw:["italian","gesture","mamma_mia"], skinnable:true },
    { char:"✌️", name:"victory_hand", kw:["peace","victory","two","scissors"], skinnable:true },
    { char:"🤞", name:"crossed_fingers", kw:["luck","wish","hope","fingers_crossed"], skinnable:true },
    { char:"🤟", name:"love_you_gesture", kw:["love","hand","sign","ily"], skinnable:true },
    { char:"🤘", name:"sign_of_the_horns", kw:["rock","metal","horns","devil"], skinnable:true },
    { char:"🤙", name:"call_me_hand", kw:["call","phone","hang_loose","shaka"], skinnable:true },
    { char:"👈", name:"backhand_index_pointing_left", kw:["point","left","this"], skinnable:true },
    { char:"👉", name:"backhand_index_pointing_right", kw:["point","right","this"], skinnable:true },
    { char:"👆", name:"backhand_index_pointing_up", kw:["point","up","above"], skinnable:true },
    { char:"🖕", name:"middle_finger", kw:["middle_finger","rude","flip"], skinnable:true },
    { char:"👇", name:"backhand_index_pointing_down", kw:["point","down","below"], skinnable:true },
    { char:"☝️", name:"index_pointing_up", kw:["point","up","one"], skinnable:true },
    { char:"👍", name:"thumbs_up", kw:["thumbs_up","like","approve","good","yes"], skinnable:true },
    { char:"👎", name:"thumbs_down", kw:["thumbs_down","dislike","bad","no"], skinnable:true },
    { char:"✊", name:"raised_fist", kw:["fist","power","fight"], skinnable:true },
    { char:"👊", name:"oncoming_fist", kw:["fist","punch","fight"], skinnable:true },
    { char:"🤛", name:"left_facing_fist", kw:["fist","left","bump"], skinnable:true },
    { char:"🤜", name:"right_facing_fist", kw:["fist","right","bump"], skinnable:true },
    { char:"👏", name:"clapping_hands", kw:["clap","applause","congrats","bravo"], skinnable:true },
    { char:"🙌", name:"raising_hands", kw:["celebrate","raise","hallelujah","hooray"], skinnable:true },
    { char:"👐", name:"open_hands", kw:["open","hug","hands"], skinnable:true },
    { char:"🤲", name:"palms_up_together", kw:["pray","hands","cup"], skinnable:true },
    { char:"🤝", name:"handshake", kw:["handshake","deal","agree","partner"] },
    { char:"🙏", name:"folded_hands", kw:["pray","thanks","please","namaste","hope"], skinnable:true },
    { char:"✍️", name:"writing_hand", kw:["write","pen","sign"], skinnable:true },
    { char:"💅", name:"nail_polish", kw:["nails","beauty","polish","manicure"], skinnable:true },
    { char:"🤳", name:"selfie", kw:["selfie","photo","camera","phone"], skinnable:true },
    { char:"💪", name:"flexed_biceps", kw:["muscle","strong","flex","workout","bicep"], skinnable:true },
    { char:"🦾", name:"mechanical_arm", kw:["robot","arm","prosthetic"] },
    { char:"🦿", name:"mechanical_leg", kw:["robot","leg","prosthetic"] },
    { char:"🦵", name:"leg", kw:["leg","kick"], skinnable:true },
    { char:"🦶", name:"foot", kw:["foot","kick","stomp"], skinnable:true },
    { char:"👂", name:"ear", kw:["ear","listen","hear"], skinnable:true },
    { char:"🦻", name:"ear_with_hearing_aid", kw:["ear","deaf","hearing"], skinnable:true },
    { char:"👃", name:"nose", kw:["nose","smell"], skinnable:true },
    { char:"🧠", name:"brain", kw:["brain","smart","think","mind"] },
    { char:"🦷", name:"tooth", kw:["tooth","dentist","teeth"] },
    { char:"🦴", name:"bone", kw:["bone","dog","skeleton"] },
    { char:"👀", name:"eyes", kw:["eyes","look","see","watch"] },
    { char:"👁️", name:"eye", kw:["eye","see","look"] },
    { char:"👅", name:"tongue", kw:["tongue","taste","lick"] },
    { char:"👄", name:"mouth", kw:["mouth","lips","speak"] },
    { char:"🫀", name:"anatomical_heart", kw:["heart","organ","health"] },
    { char:"🫁", name:"lungs", kw:["lungs","breath","organ"] },
    { char:"👶", name:"baby", kw:["baby","infant","child"], skinnable:true },
    { char:"🧒", name:"child", kw:["child","kid","young"], skinnable:true },
    { char:"👦", name:"boy", kw:["boy","kid","male"], skinnable:true },
    { char:"👧", name:"girl", kw:["girl","kid","female"], skinnable:true },
    { char:"🧑", name:"person", kw:["person","human","adult"], skinnable:true },
    { char:"👱", name:"person_blond_hair", kw:["blonde","person","fair"], skinnable:true },
    { char:"👨", name:"man", kw:["man","male","adult"], skinnable:true },
    { char:"🧔", name:"person_beard", kw:["beard","man","facial_hair"], skinnable:true },
    { char:"👩", name:"woman", kw:["woman","female","adult"], skinnable:true },
    { char:"🧓", name:"older_person", kw:["old","elderly","senior"], skinnable:true },
    { char:"👴", name:"old_man", kw:["old","man","elderly","grandfather"], skinnable:true },
    { char:"👵", name:"old_woman", kw:["old","woman","elderly","grandmother"], skinnable:true },
    { char:"🙍", name:"person_frowning", kw:["frown","unhappy","person"], skinnable:true },
    { char:"🙎", name:"person_pouting", kw:["pout","unhappy","person"], skinnable:true },
    { char:"🙅", name:"person_gesturing_no", kw:["no","stop","deny","person"], skinnable:true },
    { char:"🙆", name:"person_gesturing_ok", kw:["ok","yes","agree","person"], skinnable:true },
    { char:"💁", name:"person_tipping_hand", kw:["info","tip","sassy","person"], skinnable:true },
    { char:"🙋", name:"person_raising_hand", kw:["raise","hand","question","volunteer"], skinnable:true },
    { char:"🧏", name:"deaf_person", kw:["deaf","hearing","sign"], skinnable:true },
    { char:"🙇", name:"person_bowing", kw:["bow","sorry","humble","thank"], skinnable:true },
    { char:"🤦", name:"person_facepalming", kw:["facepalm","doh","seriously","smh"], skinnable:true },
    { char:"🤷", name:"person_shrugging", kw:["shrug","idk","whatever","dunno"], skinnable:true },
    { char:"💆", name:"person_getting_massage", kw:["massage","relax","spa"], skinnable:true },
    { char:"💇", name:"person_getting_haircut", kw:["haircut","salon","barber"], skinnable:true },
    { char:"🚶", name:"person_walking", kw:["walk","person","pedestrian"], skinnable:true },
    { char:"🧍", name:"person_standing", kw:["stand","person","upright"], skinnable:true },
    { char:"🧎", name:"person_kneeling", kw:["kneel","down","person"], skinnable:true },
    { char:"🏃", name:"person_running", kw:["run","jog","sprint","fast"], skinnable:true },
    { char:"💃", name:"woman_dancing", kw:["dance","woman","flamenco"], skinnable:true },
    { char:"🕺", name:"man_dancing", kw:["dance","man","disco"], skinnable:true },
    { char:"🕴️", name:"person_levitating", kw:["levitate","fly","business","ska"], skinnable:true },
    { char:"🧖", name:"person_in_steamy_room", kw:["sauna","steam","relax","spa"], skinnable:true },
    { char:"🧘", name:"person_in_lotus_position", kw:["meditation","yoga","lotus","zen"], skinnable:true },
    { char:"🛀", name:"person_taking_bath", kw:["bath","bathtub","relax","wash"], skinnable:true },
    { char:"🛌", name:"person_in_bed", kw:["sleep","bed","night","rest"], skinnable:true },
    { char:"🧑‍🤝‍🧑", name:"people_holding_hands", kw:["hold_hands","couple","together","friend"] },
    { char:"👫", name:"woman_and_man_holding_hands", kw:["couple","hold_hands","love"] },
    { char:"👬", name:"men_holding_hands", kw:["couple","men","love","gay"] },
    { char:"👭", name:"women_holding_hands", kw:["couple","women","love","lesbian"] },
    { char:"💑", name:"couple_with_heart", kw:["couple","love","heart","romance"] },
    { char:"💏", name:"kiss", kw:["kiss","couple","love","romance"] },
    { char:"👨‍👩‍👦", name:"family_man_woman_boy", kw:["family","parents","child"] },
    { char:"👨‍👩‍👧", name:"family_man_woman_girl", kw:["family","parents","child"] },
    { char:"👨‍👩‍👧‍👦", name:"family_man_woman_girl_boy", kw:["family","parents","children"] }
  ],
  "Animals & Nature": [
    { char:"🐶", name:"dog_face", kw:["dog","puppy","pet","woof"] },
    { char:"🐱", name:"cat_face", kw:["cat","kitten","pet","meow"] },
    { char:"🐭", name:"mouse_face", kw:["mouse","rodent","small"] },
    { char:"🐹", name:"hamster", kw:["hamster","pet","cute"] },
    { char:"🐰", name:"rabbit_face", kw:["rabbit","bunny","easter","hop"] },
    { char:"🦊", name:"fox", kw:["fox","clever","orange"] },
    { char:"🐻", name:"bear", kw:["bear","teddy","strong"] },
    { char:"🐼", name:"panda", kw:["panda","china","bamboo","cute"] },
    { char:"🐻‍❄️", name:"polar_bear", kw:["polar_bear","white","arctic","snow"] },
    { char:"🐨", name:"koala", kw:["koala","australia","marsupial","cute"] },
    { char:"🐯", name:"tiger_face", kw:["tiger","stripe","wild","fierce"] },
    { char:"🦁", name:"lion", kw:["lion","king","roar","brave"] },
    { char:"🐮", name:"cow_face", kw:["cow","moo","milk","farm"] },
    { char:"🐷", name:"pig_face", kw:["pig","oink","farm","bacon"] },
    { char:"🐸", name:"frog", kw:["frog","toad","leap","green"] },
    { char:"🐵", name:"monkey_face", kw:["monkey","primate","banana","see"] },
    { char:"🙈", name:"see_no_evil_monkey", kw:["monkey","see","evil","cover"] },
    { char:"🙉", name:"hear_no_evil_monkey", kw:["monkey","hear","evil"] },
    { char:"🙊", name:"speak_no_evil_monkey", kw:["monkey","speak","evil"] },
    { char:"🐒", name:"monkey", kw:["monkey","primate","animal"] },
    { char:"🦆", name:"duck", kw:["duck","bird","quack","water"] },
    { char:"🦅", name:"eagle", kw:["eagle","bird","freedom","fly","majestic"] },
    { char:"🦉", name:"owl", kw:["owl","wise","night","bird"] },
    { char:"🦇", name:"bat", kw:["bat","night","vampire","halloween"] },
    { char:"🐝", name:"honeybee", kw:["bee","honey","sting","flower"] },
    { char:"🐛", name:"bug", kw:["bug","caterpillar","insect"] },
    { char:"🦋", name:"butterfly", kw:["butterfly","insect","transform","flower"] },
    { char:"🐌", name:"snail", kw:["snail","slow","shell","slug"] },
    { char:"🐞", name:"lady_beetle", kw:["ladybug","beetle","insect","red","lucky"] },
    { char:"🐜", name:"ant", kw:["ant","insect","colony","work"] },
    { char:"🐢", name:"turtle", kw:["turtle","slow","sea","shell"] },
    { char:"🐍", name:"snake", kw:["snake","reptile","slither","hiss"] },
    { char:"🦖", name:"t_rex", kw:["t_rex","dinosaur","roar","extinct","jurassic"] },
    { char:"🦕", name:"sauropod", kw:["dinosaur","long_neck","extinct","sauropod"] },
    { char:"🐊", name:"crocodile", kw:["crocodile","gator","reptile","bite"] },
    { char:"🐸", name:"frog_face", kw:["frog","green","leap","pond"] },
    { char:"🐳", name:"spouting_whale", kw:["whale","ocean","big","sea"] },
    { char:"🐬", name:"dolphin", kw:["dolphin","smart","ocean","flipper"] },
    { char:"🦈", name:"shark", kw:["shark","ocean","bite","scary","jaws"] },
    { char:"🐟", name:"fish", kw:["fish","sea","ocean","swim"] },
    { char:"🐠", name:"tropical_fish", kw:["tropical","fish","colorful","coral"] },
    { char:"🦞", name:"lobster", kw:["lobster","seafood","red","claws"] },
    { char:"🦀", name:"crab", kw:["crab","seafood","sideways","claws"] },
    { char:"🐙", name:"octopus", kw:["octopus","tentacles","ocean","ink"] },
    { char:"🦑", name:"squid", kw:["squid","tentacles","ocean","ink"] },
    { char:"🌸", name:"cherry_blossom", kw:["cherry_blossom","japan","spring","flower","pink"] },
    { char:"🌺", name:"hibiscus", kw:["hibiscus","flower","tropical","hawaii"] },
    { char:"🌻", name:"sunflower", kw:["sunflower","sun","flower","yellow"] },
    { char:"🌹", name:"rose", kw:["rose","flower","love","red","romantic"] },
    { char:"🥀", name:"wilted_flower", kw:["wilted","dead","flower","sad"] },
    { char:"🌷", name:"tulip", kw:["tulip","flower","spring","pink"] },
    { char:"🌱", name:"seedling", kw:["seedling","plant","grow","green","nature"] },
    { char:"🌿", name:"herb", kw:["herb","plant","leaf","nature"] },
    { char:"☘️", name:"shamrock", kw:["shamrock","ireland","lucky","green","clover"] },
    { char:"🍀", name:"four_leaf_clover", kw:["clover","lucky","four_leaf","green"] },
    { char:"🍁", name:"maple_leaf", kw:["maple","leaf","fall","canada","autumn"] },
    { char:"🍂", name:"fallen_leaf", kw:["leaf","fall","autumn","nature"] },
    { char:"🍃", name:"leaf_fluttering_in_wind", kw:["leaf","wind","nature","flutter"] },
    { char:"🌾", name:"sheaf_of_rice", kw:["rice","wheat","grain","farm","autumn"] },
    { char:"🌵", name:"cactus", kw:["cactus","desert","prickly","plant"] },
    { char:"🌴", name:"palm_tree", kw:["palm","tropical","beach","coconut"] },
    { char:"🌳", name:"deciduous_tree", kw:["tree","nature","green","forest"] },
    { char:"🌲", name:"evergreen_tree", kw:["tree","pine","christmas","forest","green"] },
    { char:"🌋", name:"volcano", kw:["volcano","eruption","fire","lava","mountain"] },
    { char:"🌊", name:"water_wave", kw:["wave","ocean","surf","tsunami","sea"] },
    { char:"🌈", name:"rainbow", kw:["rainbow","colorful","lgbt","rain","sunshine"] },
    { char:"⭐", name:"star", kw:["star","night","sky","shine"] },
    { char:"🌟", name:"glowing_star", kw:["star","glow","shine","gold"] },
    { char:"✨", name:"sparkles", kw:["sparkle","shine","magic","stars","glitter"] },
    { char:"❄️", name:"snowflake", kw:["snow","cold","winter","ice","flake"] },
    { char:"🌙", name:"crescent_moon", kw:["moon","night","sleep","crescent"] },
    { char:"☀️", name:"sun", kw:["sun","sunny","hot","bright","day"] },
    { char:"⛅", name:"sun_behind_cloud", kw:["cloudy","partly_sunny","weather"] },
    { char:"🌤️", name:"sun_small_cloud", kw:["mostly_sunny","weather","clear"] },
    { char:"⛈️", name:"cloud_lightning_rain", kw:["storm","thunder","lightning","rain"] },
    { char:"🌩️", name:"cloud_with_lightning", kw:["lightning","thunder","storm","electric"] },
    { char:"🌧️", name:"cloud_with_rain", kw:["rain","cloudy","wet","umbrella"] },
    { char:"❤️‍🔥", name:"heart_on_fire", kw:["passion","love","fire","intense"] },
    { char:"🐕", name:"dog", kw:["dog","pet","bark","woof","good_boy"] },
    { char:"🐈", name:"cat", kw:["cat","pet","meow","kitty"] },
    { char:"🐓", name:"rooster", kw:["rooster","farm","morning","cock","bird"] },
    { char:"🦚", name:"peacock", kw:["peacock","colorful","bird","feathers","proud"] },
    { char:"🦜", name:"parrot", kw:["parrot","talk","colorful","tropical","bird"] },
    { char:"🦩", name:"flamingo", kw:["flamingo","pink","bird","elegant","stand"] },
    { char:"🦢", name:"swan", kw:["swan","elegant","white","lake","bird"] },
    { char:"🦦", name:"otter", kw:["otter","water","cute","hold","float"] },
    { char:"🦥", name:"sloth", kw:["sloth","slow","hang","tree","lazy"] },
    { char:"🦔", name:"hedgehog", kw:["hedgehog","spiky","cute","forest","small"] },
    { char:"🦘", name:"kangaroo", kw:["kangaroo","australia","hop","pouchy","jump"] },
    { char:"🦙", name:"llama", kw:["llama","alpaca","spit","fluffy","south_america"] },
    { char:"🦬", name:"bison", kw:["bison","buffalo","strong","plain","bull"] },
    { char:"🐃", name:"water_buffalo", kw:["buffalo","water","horns","strong"] },
    { char:"🐂", name:"ox", kw:["ox","bull","horns","farm","strong"] },
    { char:"🦏", name:"rhinoceros", kw:["rhino","horn","big","africa","endangered"] },
    { char:"🦛", name:"hippopotamus", kw:["hippo","river","big","africa","mouth"] },
    { char:"🐘", name:"elephant", kw:["elephant","trunk","big","africa","memory"] },
    { char:"🦒", name:"giraffe", kw:["giraffe","tall","neck","africa","spots"] },
    { char:"🦓", name:"zebra", kw:["zebra","stripes","africa","horse"] },
    { char:"🦌", name:"deer", kw:["deer","antlers","forest","bambi","gentle"] },
    { char:"🐎", name:"horse", kw:["horse","gallop","ride","stable","neigh"] },
    { char:"🐖", name:"pig", kw:["pig","farm","oink","mud","bacon"] },
    { char:"🐏", name:"ram", kw:["ram","sheep","horns","wool","farm"] },
    { char:"🐑", name:"ewe", kw:["sheep","wool","farm","baa","lamb"] },
    { char:"🐐", name:"goat", kw:["goat","horns","mountain","farm","billy"] },
    { char:"🦙", name:"alpaca", kw:["alpaca","llama","fluffy","peru","herd"] }
  ],
  "Food & Drink": [
    { char:"🍏", name:"green_apple", kw:["apple","green","fruit","healthy"] },
    { char:"🍎", name:"red_apple", kw:["apple","red","fruit","teacher"] },
    { char:"🍐", name:"pear", kw:["pear","green","fruit","juicy"] },
    { char:"🍊", name:"tangerine", kw:["orange","tangerine","fruit","citrus"] },
    { char:"🍋", name:"lemon", kw:["lemon","sour","citrus","yellow","fruit"] },
    { char:"🍌", name:"banana", kw:["banana","yellow","fruit","monkey","slip"] },
    { char:"🍉", name:"watermelon", kw:["watermelon","summer","fruit","green","red"] },
    { char:"🍇", name:"grapes", kw:["grapes","wine","fruit","purple","cluster"] },
    { char:"🍓", name:"strawberry", kw:["strawberry","red","fruit","sweet","summer"] },
    { char:"🫐", name:"blueberries", kw:["blueberry","fruit","blue","antioxidant"] },
    { char:"🍈", name:"melon", kw:["melon","cantaloupe","fruit","green","sweet"] },
    { char:"🍒", name:"cherries", kw:["cherry","red","fruit","sweet","pair"] },
    { char:"🍑", name:"peach", kw:["peach","fruit","soft","fuzzy","butt"] },
    { char:"🥭", name:"mango", kw:["mango","tropical","fruit","orange","sweet"] },
    { char:"🍍", name:"pineapple", kw:["pineapple","tropical","fruit","yellow","spiky"] },
    { char:"🥥", name:"coconut", kw:["coconut","tropical","milk","palm","white"] },
    { char:"🥝", name:"kiwi_fruit", kw:["kiwi","green","fruit","new_zealand","exotic"] },
    { char:"🍅", name:"tomato", kw:["tomato","red","fruit","salad","sauce"] },
    { char:"🫒", name:"olive", kw:["olive","green","mediterranean","oil","tree"] },
    { char:"🥑", name:"avocado", kw:["avocado","green","toast","guacamole","millennial"] },
    { char:"🍆", name:"eggplant", kw:["eggplant","purple","vegetable","aubergine"] },
    { char:"🥔", name:"potato", kw:["potato","starch","vegetable","tuber","fries"] },
    { char:"🥕", name:"carrot", kw:["carrot","orange","vegetable","rabbit","healthy"] },
    { char:"🌽", name:"ear_of_corn", kw:["corn","maize","yellow","vegetable","popcorn"] },
    { char:"🌶️", name:"hot_pepper", kw:["pepper","spicy","hot","chili","red"] },
    { char:"🫑", name:"bell_pepper", kw:["pepper","vegetable","colorful","capsicum"] },
    { char:"🥒", name:"cucumber", kw:["cucumber","green","cool","vegetable","fresh"] },
    { char:"🥬", name:"leafy_green", kw:["lettuce","leafy","green","salad","healthy"] },
    { char:"🥦", name:"broccoli", kw:["broccoli","green","healthy","tree","vegetable"] },
    { char:"🧄", name:"garlic", kw:["garlic","smelly","vampire","flavor","Italian"] },
    { char:"🧅", name:"onion", kw:["onion","cry","flavor","cooking","layer"] },
    { char:"🍄", name:"mushroom", kw:["mushroom","fungus","mario","forest","magic"] },
    { char:"🥜", name:"peanuts", kw:["peanut","nut","allergy","butter","snack"] },
    { char:"🌰", name:"chestnut", kw:["chestnut","nut","autumn","brown","roasted"] },
    { char:"🍞", name:"bread", kw:["bread","loaf","bakery","toast","wheat"] },
    { char:"🥐", name:"croissant", kw:["croissant","french","pastry","breakfast","flaky"] },
    { char:"🥖", name:"baguette_bread", kw:["baguette","french","bread","bakery"] },
    { char:"🫓", name:"flatbread", kw:["flatbread","pita","naan","bread"] },
    { char:"🥨", name:"pretzel", kw:["pretzel","twisted","german","snack","salty"] },
    { char:"🥯", name:"bagel", kw:["bagel","bread","breakfast","round","jewish"] },
    { char:"🧀", name:"cheese_wedge", kw:["cheese","yellow","dairy","mouse","pizza"] },
    { char:"🥚", name:"egg", kw:["egg","breakfast","chicken","oval","protein"] },
    { char:"🍳", name:"cooking", kw:["fried_egg","cooking","breakfast","pan","sunny_side"] },
    { char:"🥞", name:"pancakes", kw:["pancakes","breakfast","syrup","stack","fluffy"] },
    { char:"🧇", name:"waffle", kw:["waffle","breakfast","syrup","grid","crispy"] },
    { char:"🥓", name:"bacon", kw:["bacon","crispy","breakfast","pork","yum"] },
    { char:"🥩", name:"cut_of_meat", kw:["steak","meat","protein","beefy","dinner"] },
    { char:"🍗", name:"poultry_leg", kw:["chicken","turkey","leg","fried","dinner"] },
    { char:"🍖", name:"meat_on_bone", kw:["meat","bone","dinosaur","roasted"] },
    { char:"🌭", name:"hot_dog", kw:["hotdog","sausage","bun","street_food","summer"] },
    { char:"🍔", name:"hamburger", kw:["burger","hamburger","fast_food","beef","bun"] },
    { char:"🍟", name:"french_fries", kw:["fries","potatoes","mcdonalds","salty","yum"] },
    { char:"🍕", name:"pizza", kw:["pizza","italian","cheese","slice","delivery"] },
    { char:"🫔", name:"tamale", kw:["tamale","mexican","corn","wrapped","traditional"] },
    { char:"🌮", name:"taco", kw:["taco","mexican","shell","tuesday","wrap"] },
    { char:"🌯", name:"burrito", kw:["burrito","wrap","mexican","beans","tortilla"] },
    { char:"🥙", name:"stuffed_flatbread", kw:["shawarma","pita","flatbread","falafel","wrap"] },
    { char:"🧆", name:"falafel", kw:["falafel","middle_eastern","vegetarian","chickpea"] },
    { char:"🥗", name:"green_salad", kw:["salad","healthy","green","lettuce","vegetable"] },
    { char:"🥘", name:"shallow_pan_of_food", kw:["paella","casserole","rice","dish","stew"] },
    { char:"🫕", name:"fondue", kw:["fondue","cheese","chocolate","dipping","swiss"] },
    { char:"🍲", name:"pot_of_food", kw:["stew","soup","pot","hotpot","cook"] },
    { char:"🍛", name:"curry_rice", kw:["curry","indian","rice","spicy","orange"] },
    { char:"🍜", name:"steaming_bowl", kw:["ramen","noodles","soup","asian","japan"] },
    { char:"🍝", name:"spaghetti", kw:["pasta","spaghetti","italian","noodles","tomato"] },
    { char:"🍠", name:"roasted_sweet_potato", kw:["sweet_potato","roasted","japanese","yam","healthy"] },
    { char:"🍢", name:"oden", kw:["oden","japanese","skewer","broth","stew"] },
    { char:"🍣", name:"sushi", kw:["sushi","japanese","fish","rice","raw"] },
    { char:"🍤", name:"fried_shrimp", kw:["shrimp","fried","seafood","tempura","crispy"] },
    { char:"🍥", name:"fish_cake_with_swirl", kw:["narutomaki","fish_cake","japanese","swirl"] },
    { char:"🥮", name:"moon_cake", kw:["mooncake","chinese","festival","moon"] },
    { char:"🍡", name:"dango", kw:["dango","japanese","sweet","skewer","mochi"] },
    { char:"🥟", name:"dumpling", kw:["dumpling","gyoza","potsticker","dim_sum","chinese"] },
    { char:"🥠", name:"fortune_cookie", kw:["fortune","cookie","chinese","prediction","lucky"] },
    { char:"🍦", name:"soft_ice_cream", kw:["ice_cream","soft","vanilla","swirl","summer"] },
    { char:"🍧", name:"shaved_ice", kw:["shaved_ice","cool","cold","summer","sweet"] },
    { char:"🍨", name:"ice_cream", kw:["ice_cream","cold","scoop","bowl","sweet"] },
    { char:"🍩", name:"doughnut", kw:["donut","doughnut","glazed","round","hole"] },
    { char:"🍪", name:"cookie", kw:["cookie","chocolate_chip","sweet","bake","yum"] },
    { char:"🎂", name:"birthday_cake", kw:["birthday","cake","candles","celebrate","party"] },
    { char:"🍰", name:"shortcake", kw:["cake","slice","strawberry","dessert","sweet"] },
    { char:"🧁", name:"cupcake", kw:["cupcake","frosting","sweet","bake","party"] },
    { char:"🥧", name:"pie", kw:["pie","crust","apple","dessert","bake"] },
    { char:"🍫", name:"chocolate_bar", kw:["chocolate","candy","bar","sweet","cocoa"] },
    { char:"🍬", name:"candy", kw:["candy","sweet","sugar","lollipop","kids"] },
    { char:"🍭", name:"lollipop", kw:["lollipop","candy","swirl","sweet","kids"] },
    { char:"🍮", name:"custard", kw:["custard","flan","pudding","caramel","dessert"] },
    { char:"🍯", name:"honey_pot", kw:["honey","pot","bee","golden","sweet"] },
    { char:"☕", name:"hot_beverage", kw:["coffee","tea","hot","beverage","morning"] },
    { char:"🫖", name:"teapot", kw:["tea","teapot","brew","herbal","cozy"] },
    { char:"🍵", name:"teacup_without_handle", kw:["tea","green_tea","japanese","cup","cozy"] },
    { char:"🧃", name:"beverage_box", kw:["juice","box","drink","straw","kids"] },
    { char:"🥤", name:"cup_with_straw", kw:["drink","soda","straw","cup","fast_food"] },
    { char:"🧋", name:"bubble_tea", kw:["boba","bubble_tea","taiwan","tapioca","milktea"] },
    { char:"🍺", name:"beer_mug", kw:["beer","mug","cold","cheers","pub"] },
    { char:"🍻", name:"clinking_beer_mugs", kw:["beer","cheers","toast","pub","celebrate"] },
    { char:"🥂", name:"clinking_glasses", kw:["champagne","toast","celebrate","cheers","sparkling"] },
    { char:"🍷", name:"wine_glass", kw:["wine","red","glass","drink","elegant"] },
    { char:"🥃", name:"tumbler_glass", kw:["whiskey","bourbon","glass","drink","ice"] },
    { char:"🍸", name:"cocktail_glass", kw:["cocktail","martini","glass","bar","mix"] },
    { char:"🍹", name:"tropical_drink", kw:["tropical","cocktail","umbrella","vacation","fun"] },
    { char:"🧉", name:"mate", kw:["mate","south_american","herbal","gourd","drink"] },
    { char:"🍾", name:"bottle_with_popping_cork", kw:["champagne","celebrate","cork","pop","party"] },
    { char:"🧊", name:"ice", kw:["ice","cold","cube","freeze","chill"] }
  ],
  "Activities": [
    { char:"⚽", name:"soccer_ball", kw:["soccer","football","ball","sport","kick"] },
    { char:"🏀", name:"basketball", kw:["basketball","nba","ball","sport","hoop"] },
    { char:"🏈", name:"american_football", kw:["football","nfl","sport","touchdown","america"] },
    { char:"⚾", name:"baseball", kw:["baseball","mlb","sport","pitcher","bat"] },
    { char:"🥎", name:"softball", kw:["softball","sport","ball","pitch"] },
    { char:"🏐", name:"volleyball", kw:["volleyball","sport","net","beach","spike"] },
    { char:"🏉", name:"rugby_football", kw:["rugby","football","sport","oval","tackle"] },
    { char:"🎾", name:"tennis", kw:["tennis","ball","sport","racket","wimbledon"] },
    { char:"🏸", name:"badminton", kw:["badminton","shuttlecock","racket","sport"] },
    { char:"🏒", name:"ice_hockey", kw:["hockey","ice","puck","nhl","sport"] },
    { char:"🏓", name:"ping_pong", kw:["ping_pong","table_tennis","sport","paddle"] },
    { char:"🥊", name:"boxing_glove", kw:["boxing","fight","punch","sport","glove"] },
    { char:"🥋", name:"martial_arts_uniform", kw:["martial_arts","karate","judo","uniform","sport"] },
    { char:"⛳", name:"flag_in_hole", kw:["golf","hole","sport","course","putt"] },
    { char:"🏹", name:"bow_and_arrow", kw:["archery","bow","arrow","sport","shoot"] },
    { char:"🎣", name:"fishing_pole", kw:["fishing","fish","sport","pole","rod"] },
    { char:"🤿", name:"diving_mask", kw:["diving","snorkel","ocean","mask","underwater"] },
    { char:"🎽", name:"running_shirt", kw:["running","sport","shirt","race","marathon"] },
    { char:"🎿", name:"skis", kw:["ski","winter","snow","sport","mountain"] },
    { char:"🛷", name:"sled", kw:["sled","snow","winter","slide","christmas"] },
    { char:"🥌", name:"curling_stone", kw:["curling","sport","stone","ice","canada"] },
    { char:"🎯", name:"direct_hit", kw:["dart","bullseye","target","aim","hit"] },
    { char:"🪃", name:"boomerang", kw:["boomerang","throw","australia","curved","return"] },
    { char:"🪁", name:"slingshot", kw:["slingshot","aim","throw","catapult","david"] },
    { char:"🎱", name:"pool_8_ball", kw:["billiards","pool","8_ball","cue","shot"] },
    { char:"🔮", name:"crystal_ball", kw:["crystal_ball","fortune","predict","psychic","magic"] },
    { char:"🎮", name:"video_game", kw:["gaming","controller","play","videogame","console"] },
    { char:"🕹️", name:"joystick", kw:["joystick","game","arcade","play","control"] },
    { char:"🎲", name:"game_die", kw:["dice","game","random","d6","roll"] },
    { char:"♟️", name:"chess_pawn", kw:["chess","pawn","game","strategy","black"] },
    { char:"🧩", name:"puzzle_piece", kw:["puzzle","jigsaw","piece","solve","fit"] },
    { char:"🪆", name:"nesting_dolls", kw:["matryoshka","russian","dolls","nest","set"] },
    { char:"🧸", name:"teddy_bear", kw:["teddy","bear","plush","soft","toy","comfort"] },
    { char:"🪅", name:"pinata", kw:["pinata","party","birthday","candy","mexican"] },
    { char:"🎭", name:"performing_arts", kw:["theater","drama","mask","comedy","tragedy"] },
    { char:"🎨", name:"artist_palette", kw:["art","paint","palette","creative","artist"] },
    { char:"🖼️", name:"framed_picture", kw:["art","picture","frame","museum","gallery"] },
    { char:"🎪", name:"circus_tent", kw:["circus","tent","carnival","fair","performance"] },
    { char:"🎤", name:"microphone", kw:["mic","sing","karaoke","music","performance"] },
    { char:"🎧", name:"headphone", kw:["headphones","music","audio","listen","bass"] },
    { char:"🎼", name:"musical_score", kw:["music","score","notes","sheet","compose"] },
    { char:"🎹", name:"musical_keyboard", kw:["piano","keyboard","music","keys","classical"] },
    { char:"🪘", name:"long_drum", kw:["drum","percussion","music","beat","rhythm"] },
    { char:"🥁", name:"drum", kw:["drum","beat","music","percussion","rock"] },
    { char:"🎷", name:"saxophone", kw:["saxophone","sax","jazz","music","brass"] },
    { char:"🎺", name:"trumpet", kw:["trumpet","jazz","music","brass","fanfare"] },
    { char:"🎸", name:"guitar", kw:["guitar","music","rock","string","strum"] },
    { char:"🪕", name:"banjo", kw:["banjo","country","music","string","folk"] },
    { char:"🎻", name:"violin", kw:["violin","classical","music","string","bow"] },
    { char:"🪗", name:"accordion", kw:["accordion","music","folk","squeeze","polka"] },
    { char:"🎬", name:"clapper_board", kw:["movie","film","action","director","cinema"] },
    { char:"🎥", name:"movie_camera", kw:["camera","film","movie","recording","cinema"] },
    { char:"📽️", name:"film_projector", kw:["projector","film","movie","cinema","vintage"] },
    { char:"🎞️", name:"film_frames", kw:["film","movie","strip","cinema","photo"] },
    { char:"📺", name:"television", kw:["tv","television","watch","screen","channel"] },
    { char:"📻", name:"radio", kw:["radio","music","broadcast","listen","vintage"] },
    { char:"🎙️", name:"studio_microphone", kw:["podcast","mic","record","broadcast","studio"] },
    { char:"🎚️", name:"level_slider", kw:["slider","level","audio","mix","volume"] },
    { char:"🎛️", name:"control_knobs", kw:["knobs","dj","audio","control","mix"] },
    { char:"🎊", name:"confetti_ball", kw:["confetti","party","celebrate","pop","fun"] },
    { char:"🎉", name:"party_popper", kw:["party","celebrate","tada","confetti","fun"] },
    { char:"🎈", name:"balloon", kw:["balloon","party","birthday","float","red"] },
    { char:"🎁", name:"wrapped_gift", kw:["gift","present","birthday","christmas","box"] },
    { char:"🏆", name:"trophy", kw:["trophy","winner","gold","first","champion"] },
    { char:"🥇", name:"1st_place_medal", kw:["gold","medal","first","winner","olympic"] },
    { char:"🥈", name:"2nd_place_medal", kw:["silver","medal","second","olympic"] },
    { char:"🥉", name:"3rd_place_medal", kw:["bronze","medal","third","olympic"] },
    { char:"🎖️", name:"military_medal", kw:["medal","military","award","honor","ribbon"] },
    { char:"🏅", name:"sports_medal", kw:["medal","sport","award","gold","win"] },
    { char:"🎗️", name:"reminder_ribbon", kw:["ribbon","awareness","cause","reminder"] },
    { char:"🎟️", name:"admission_tickets", kw:["ticket","event","cinema","show","enter"] },
    { char:"🎫", name:"ticket", kw:["ticket","event","concert","movie","admit"] }
  ],
  "Travel & Places": [
    { char:"🚗", name:"automobile", kw:["car","drive","road","vehicle","red"] },
    { char:"🚕", name:"taxi", kw:["taxi","cab","yellow","ride","city"] },
    { char:"🚙", name:"sport_utility_vehicle", kw:["suv","car","drive","off_road"] },
    { char:"🚌", name:"bus", kw:["bus","public","transport","city","route"] },
    { char:"🚎", name:"trolleybus", kw:["trolley","bus","electric","city","transport"] },
    { char:"🏎️", name:"racing_car", kw:["racing","formula1","car","fast","sport"] },
    { char:"🚓", name:"police_car", kw:["police","cop","law","blue","sirens"] },
    { char:"🚑", name:"ambulance", kw:["ambulance","medical","emergency","hospital","health"] },
    { char:"🚒", name:"fire_engine", kw:["fire","truck","engine","emergency","red"] },
    { char:"🚐", name:"minibus", kw:["minibus","van","transport","shuttle"] },
    { char:"🚚", name:"delivery_truck", kw:["delivery","truck","shipping","package","amazon"] },
    { char:"🚛", name:"articulated_lorry", kw:["lorry","truck","semi","transport","road"] },
    { char:"🚜", name:"tractor", kw:["tractor","farm","agriculture","rural","field"] },
    { char:"🦯", name:"white_cane", kw:["cane","blind","accessibility","white"] },
    { char:"🦽", name:"manual_wheelchair", kw:["wheelchair","disability","accessible","mobility"] },
    { char:"🦼", name:"motorized_wheelchair", kw:["wheelchair","electric","disability","accessible"] },
    { char:"🛵", name:"motor_scooter", kw:["scooter","moped","ride","motor","city"] },
    { char:"🏍️", name:"motorcycle", kw:["motorcycle","bike","ride","fast","biker"] },
    { char:"🛺", name:"auto_rickshaw", kw:["tuk_tuk","rickshaw","asia","transport","three_wheel"] },
    { char:"🚲", name:"bicycle", kw:["bike","bicycle","ride","eco","pedal"] },
    { char:"🛴", name:"kick_scooter", kw:["scooter","kick","electric","ride","lime"] },
    { char:"🛹", name:"skateboard", kw:["skateboard","skate","trick","sport","cool"] },
    { char:"🛼", name:"roller_skate", kw:["rollerskate","skate","retro","wheel","fun"] },
    { char:"🚏", name:"bus_stop", kw:["bus","stop","sign","transport","wait"] },
    { char:"🛣️", name:"motorway", kw:["highway","motorway","road","drive","travel"] },
    { char:"🛤️", name:"railway_track", kw:["railway","track","train","railroad"] },
    { char:"🛞", name:"wheel", kw:["wheel","tire","car","circle","spin"] },
    { char:"⛽", name:"fuel_pump", kw:["gas","fuel","petrol","station","fill"] },
    { char:"🚨", name:"police_car_light", kw:["siren","police","emergency","red","blue"] },
    { char:"🚥", name:"horizontal_traffic_light", kw:["traffic","light","signal","road","stop"] },
    { char:"🚦", name:"vertical_traffic_light", kw:["traffic","light","green","signal","go"] },
    { char:"🛑", name:"stop_sign", kw:["stop","sign","red","octagon","road"] },
    { char:"🚧", name:"construction", kw:["construction","building","caution","road","work"] },
    { char:"⚓", name:"anchor", kw:["anchor","boat","ship","ocean","dock"] },
    { char:"🛟", name:"ring_buoy", kw:["life_preserver","ring","buoy","safe","rescue"] },
    { char:"⛵", name:"sailboat", kw:["sailboat","sail","wind","ocean","boat"] },
    { char:"🚤", name:"speedboat", kw:["speedboat","boat","fast","water","motor"] },
    { char:"🛥️", name:"motor_boat", kw:["motorboat","boat","water","travel","cruise"] },
    { char:"🛳️", name:"passenger_ship", kw:["cruise","ship","ocean","voyage","liner"] },
    { char:"⛴️", name:"ferry", kw:["ferry","boat","cross","water","transport"] },
    { char:"🚢", name:"ship", kw:["ship","cruise","ocean","travel","big"] },
    { char:"✈️", name:"airplane", kw:["plane","airplane","fly","travel","jet"] },
    { char:"🛩️", name:"small_airplane", kw:["plane","small","private","fly","propeller"] },
    { char:"🚁", name:"helicopter", kw:["helicopter","fly","rotor","rescue","hover"] },
    { char:"🛸", name:"flying_saucer", kw:["ufo","alien","space","fly","sci_fi"] },
    { char:"🚀", name:"rocket", kw:["rocket","space","launch","nasa","star"] },
    { char:"🛰️", name:"satellite", kw:["satellite","space","orbit","signal","communication"] },
    { char:"💺", name:"seat", kw:["seat","chair","airplane","sit","reserve"] },
    { char:"🪂", name:"parachute", kw:["parachute","skydive","jump","fall","military"] },
    { char:"🏖️", name:"beach_with_umbrella", kw:["beach","vacation","summer","ocean","umbrella"] },
    { char:"🏝️", name:"desert_island", kw:["island","tropical","deserted","ocean","palm"] },
    { char:"🏔️", name:"snow_capped_mountain", kw:["mountain","snow","peak","hike","alps"] },
    { char:"⛰️", name:"mountain", kw:["mountain","peak","hike","cliff","altitude"] },
    { char:"🗻", name:"mount_fuji", kw:["fuji","japan","mountain","snow","iconic"] },
    { char:"🏕️", name:"camping", kw:["camping","tent","nature","outdoor","forest"] },
    { char:"🏜️", name:"desert", kw:["desert","sand","hot","cactus","sahara"] },
    { char:"🏞️", name:"national_park", kw:["park","nature","lake","forest","scenic"] },
    { char:"🏟️", name:"stadium", kw:["stadium","sport","crowd","arena","game"] },
    { char:"🏛️", name:"classical_building", kw:["greek","roman","columns","ancient","architecture"] },
    { char:"🏗️", name:"building_construction", kw:["construction","building","crane","work","develop"] },
    { char:"🧱", name:"brick", kw:["brick","wall","build","red","construction"] },
    { char:"🪟", name:"window", kw:["window","glass","house","view","open"] },
    { char:"🏠", name:"house", kw:["house","home","building","family","live"] },
    { char:"🏡", name:"house_with_garden", kw:["house","home","garden","yard","family"] },
    { char:"🏢", name:"office_building", kw:["office","building","work","business","city"] },
    { char:"🏣", name:"japanese_post_office", kw:["post_office","japan","mail","building"] },
    { char:"🏤", name:"post_office", kw:["post_office","mail","building","europe"] },
    { char:"🏥", name:"hospital", kw:["hospital","medical","health","emergency","cross"] },
    { char:"🏦", name:"bank", kw:["bank","money","finance","building","vault"] },
    { char:"🏨", name:"hotel", kw:["hotel","travel","stay","room","bell"] },
    { char:"🏪", name:"convenience_store", kw:["store","shop","convenience","7_eleven","retail"] },
    { char:"🏫", name:"school", kw:["school","education","learn","building","student"] },
    { char:"🏬", name:"department_store", kw:["department_store","shopping","retail","mall"] },
    { char:"🏭", name:"factory", kw:["factory","industrial","production","work","chimney"] },
    { char:"🏯", name:"japanese_castle", kw:["castle","japan","historic","pagoda","fortress"] },
    { char:"🏰", name:"european_castle", kw:["castle","medieval","europe","princess","tower"] },
    { char:"💒", name:"wedding", kw:["wedding","church","marry","chapel","love"] },
    { char:"🗼", name:"tokyo_tower", kw:["tokyo","tower","japan","landmark","red"] },
    { char:"🗽", name:"statue_of_liberty", kw:["liberty","usa","statue","new_york","freedom"] },
    { char:"⛪", name:"church", kw:["church","pray","cross","christian","worship"] },
    { char:"🕌", name:"mosque", kw:["mosque","islam","pray","minaret","crescent"] },
    { char:"🛕", name:"hindu_temple", kw:["temple","hindu","pray","worship","india"] },
    { char:"🕍", name:"synagogue", kw:["synagogue","jewish","pray","star_of_david"] },
    { char:"⛩️", name:"shinto_shrine", kw:["shrine","japan","torii","gate","shinto"] },
    { char:"🕋", name:"kaaba", kw:["kaaba","mecca","islam","holy","haj"] },
    { char:"⛲", name:"fountain", kw:["fountain","water","park","statue","city"] },
    { char:"⛺", name:"tent", kw:["tent","camping","outdoor","nature","sleep"] },
    { char:"🌁", name:"foggy", kw:["fog","foggy","city","morning","bridge"] },
    { char:"🌃", name:"night_with_stars", kw:["night","stars","city","dark","sky"] },
    { char:"🏙️", name:"cityscape", kw:["city","skyline","buildings","urban","night"] },
    { char:"🌄", name:"sunrise_over_mountains", kw:["sunrise","mountain","morning","dawn","sky"] },
    { char:"🌅", name:"sunrise", kw:["sunrise","morning","sky","orange","sea"] },
    { char:"🌆", name:"cityscape_at_dusk", kw:["dusk","city","sunset","evening","buildings"] },
    { char:"🌇", name:"sunset", kw:["sunset","city","evening","sky","golden"] },
    { char:"🌉", name:"bridge_at_night", kw:["bridge","night","city","golden_gate","lights"] },
    { char:"🌌", name:"milky_way", kw:["milky_way","galaxy","space","stars","night"] },
    { char:"🌠", name:"shooting_star", kw:["shooting_star","wish","meteor","night","sky"] },
    { char:"🎇", name:"sparkler", kw:["fireworks","sparkler","new_year","celebrate","light"] },
    { char:"🎆", name:"fireworks", kw:["fireworks","celebrate","explosion","new_year","colorful"] }
  ],
  "Objects": [
    { char:"⌚", name:"watch", kw:["watch","time","clock","wrist","tick"] },
    { char:"📱", name:"mobile_phone", kw:["phone","mobile","smartphone","iphone","android"] },
    { char:"📲", name:"mobile_phone_with_arrow", kw:["phone","call","download","mobile","receive"] },
    { char:"💻", name:"laptop", kw:["laptop","computer","coding","work","screen"] },
    { char:"⌨️", name:"keyboard", kw:["keyboard","type","computer","input"] },
    { char:"🖥️", name:"desktop_computer", kw:["desktop","computer","monitor","screen","work"] },
    { char:"🖨️", name:"printer", kw:["printer","print","paper","office","document"] },
    { char:"🖱️", name:"computer_mouse", kw:["mouse","cursor","click","computer","input"] },
    { char:"🖲️", name:"trackball", kw:["trackball","mouse","cursor","input","computer"] },
    { char:"💽", name:"computer_disk", kw:["disk","floppy","storage","computer","data"] },
    { char:"💾", name:"floppy_disk", kw:["floppy","save","disk","data","retro"] },
    { char:"💿", name:"optical_disk", kw:["cd","dvd","disk","music","data"] },
    { char:"📀", name:"dvd", kw:["dvd","disk","movie","data","video"] },
    { char:"🧮", name:"abacus", kw:["abacus","math","count","calculate","beads"] },
    { char:"📷", name:"camera", kw:["camera","photo","picture","snap","instagram"] },
    { char:"📸", name:"camera_with_flash", kw:["camera","photo","flash","snap","picture"] },
    { char:"📹", name:"video_camera", kw:["video","camera","record","film","movie"] },
    { char:"📼", name:"videocassette", kw:["vhs","tape","retro","record","video"] },
    { char:"🔍", name:"magnifying_glass_tilted_left", kw:["search","magnify","find","zoom","look"] },
    { char:"🔎", name:"magnifying_glass_tilted_right", kw:["search","magnify","find","zoom","look"] },
    { char:"🕯️", name:"candle", kw:["candle","light","flame","romance","birthday"] },
    { char:"💡", name:"light_bulb", kw:["bulb","idea","light","bright","innovation"] },
    { char:"🔦", name:"flashlight", kw:["flashlight","torch","light","beam","dark"] },
    { char:"🏮", name:"red_paper_lantern", kw:["lantern","paper","red","chinese","light"] },
    { char:"🪔", name:"diya_lamp", kw:["diya","lamp","diwali","flame","india"] },
    { char:"📚", name:"books", kw:["books","library","read","study","knowledge"] },
    { char:"📖", name:"open_book", kw:["book","read","open","study","library"] },
    { char:"📝", name:"memo", kw:["memo","note","write","pencil","list"] },
    { char:"📄", name:"page_facing_up", kw:["document","page","paper","file","text"] },
    { char:"📃", name:"page_with_curl", kw:["document","curl","paper","note","list"] },
    { char:"📑", name:"bookmark_tabs", kw:["tabs","bookmark","document","organize"] },
    { char:"📊", name:"bar_chart", kw:["chart","graph","data","stats","bar"] },
    { char:"📈", name:"chart_increasing", kw:["chart","growth","stock","up","trend"] },
    { char:"📉", name:"chart_decreasing", kw:["chart","decline","down","stock","trend"] },
    { char:"🗒️", name:"spiral_notepad", kw:["notepad","spiral","note","write","list"] },
    { char:"🗓️", name:"spiral_calendar", kw:["calendar","date","schedule","plan","month"] },
    { char:"📅", name:"calendar", kw:["calendar","date","month","schedule","event"] },
    { char:"📆", name:"tear_off_calendar", kw:["calendar","tear","date","day","month"] },
    { char:"🗑️", name:"wastebasket", kw:["trash","delete","bin","garbage","recycle"] },
    { char:"📁", name:"file_folder", kw:["folder","file","organize","directory"] },
    { char:"📂", name:"open_file_folder", kw:["folder","file","open","organize"] },
    { char:"🗂️", name:"card_index_dividers", kw:["dividers","organize","cards","file","tabs"] },
    { char:"🗃️", name:"card_file_box", kw:["file","box","organize","archive","cards"] },
    { char:"🗄️", name:"file_cabinet", kw:["cabinet","file","drawer","office","organize"] },
    { char:"📦", name:"package", kw:["box","package","shipping","parcel","gift"] },
    { char:"📫", name:"closed_mailbox_raised_flag", kw:["mailbox","mail","letter","flag","post"] },
    { char:"📬", name:"open_mailbox_raised_flag", kw:["mailbox","mail","open","letter","post"] },
    { char:"📮", name:"postbox", kw:["postbox","mail","post","red","letter"] },
    { char:"🗳️", name:"ballot_box_with_ballot", kw:["vote","ballot","election","democracy","box"] },
    { char:"✏️", name:"pencil", kw:["pencil","write","draw","edit","sketch"] },
    { char:"✒️", name:"black_nib", kw:["pen","nib","write","ink","calligraphy"] },
    { char:"🖋️", name:"fountain_pen", kw:["pen","fountain","write","ink","elegant"] },
    { char:"🖊️", name:"pen", kw:["pen","write","ballpoint","sign","ink"] },
    { char:"🖌️", name:"paintbrush", kw:["brush","paint","art","stroke","artist"] },
    { char:"🖍️", name:"crayon", kw:["crayon","color","draw","kids","art"] },
    { char:"📌", name:"pushpin", kw:["pushpin","pin","red","map","stuck"] },
    { char:"📍", name:"round_pushpin", kw:["pin","pushpin","location","map","marked"] },
    { char:"📎", name:"paperclip", kw:["paperclip","attach","clip","document"] },
    { char:"🖇️", name:"linked_paperclips", kw:["paperclip","linked","attach","chain","connect"] },
    { char:"📏", name:"straight_ruler", kw:["ruler","measure","line","straight","draw"] },
    { char:"📐", name:"triangular_ruler", kw:["ruler","triangle","measure","drawing","angle"] },
    { char:"✂️", name:"scissors", kw:["scissors","cut","snip","craft","school"] },
    { char:"🗃️", name:"card_index", kw:["card","index","catalog","organize","file"] },
    { char:"🔒", name:"locked", kw:["lock","secure","private","password","closed"] },
    { char:"🔓", name:"unlocked", kw:["unlock","open","secure","key","free"] },
    { char:"🔏", name:"locked_with_pen", kw:["lock","pen","edit","sign","private"] },
    { char:"🔐", name:"locked_with_key", kw:["lock","key","secure","password","safety"] },
    { char:"🔑", name:"key", kw:["key","lock","open","access","security"] },
    { char:"🗝️", name:"old_key", kw:["key","old","vintage","antique","lock"] },
    { char:"🔨", name:"hammer", kw:["hammer","tool","build","fix","nail"] },
    { char:"🪓", name:"axe", kw:["axe","chop","wood","cut","viking"] },
    { char:"⛏️", name:"pick", kw:["pick","mine","dig","tool","minecraft"] },
    { char:"⚒️", name:"hammer_and_pick", kw:["tools","hammer","pick","work","craft"] },
    { char:"🛠️", name:"hammer_and_wrench", kw:["tools","fix","build","repair","maintenance"] },
    { char:"🗡️", name:"dagger", kw:["dagger","blade","weapon","stab","knife"] },
    { char:"⚔️", name:"crossed_swords", kw:["swords","fight","battle","war","crossed"] },
    { char:"🛡️", name:"shield", kw:["shield","protect","defense","armor","block"] },
    { char:"🔧", name:"wrench", kw:["wrench","tool","fix","repair","plumber"] },
    { char:"🪛", name:"screwdriver", kw:["screwdriver","tool","fix","repair","assemble"] },
    { char:"🔩", name:"nut_and_bolt", kw:["bolt","nut","screw","tool","fix"] },
    { char:"⚙️", name:"gear", kw:["gear","settings","cog","machine","mechanic"] },
    { char:"🗜️", name:"clamp", kw:["clamp","tool","grip","hold","press"] },
    { char:"⚖️", name:"balance_scale", kw:["scale","balance","justice","law","fair"] },
    { char:"🦯", name:"probing_cane", kw:["cane","blind","navigate","probe","accessibility"] },
    { char:"🔗", name:"link", kw:["link","chain","connect","url","hyperlink"] },
    { char:"⛓️", name:"chains", kw:["chains","link","connect","prisoner","strong"] },
    { char:"🪝", name:"hook", kw:["hook","fishing","hang","catch","curved"] },
    { char:"🧲", name:"magnet", kw:["magnet","attract","magnetic","pull","horseshoe"] },
    { char:"🪜", name:"ladder", kw:["ladder","climb","step","rung","rise"] },
    { char:"🧰", name:"toolbox", kw:["toolbox","tools","repair","fix","maintain"] },
    { char:"🧲", name:"horseshoe_magnet", kw:["magnet","attract","stick","pull","iron"] },
    { char:"💊", name:"pill", kw:["pill","medicine","tablet","drug","health"] },
    { char:"💉", name:"syringe", kw:["syringe","inject","medical","vaccine","blood"] },
    { char:"🩺", name:"stethoscope", kw:["stethoscope","doctor","medical","heart","listen"] },
    { char:"🩻", name:"x_ray", kw:["x_ray","scan","medical","bone","skeleton"] },
    { char:"🧬", name:"dna", kw:["dna","genetics","science","biology","helix"] },
    { char:"🔬", name:"microscope", kw:["microscope","science","biology","lab","research"] },
    { char:"🔭", name:"telescope", kw:["telescope","space","astronomy","star","observe"] },
    { char:"🌡️", name:"thermometer", kw:["thermometer","temperature","heat","cold","fever"] },
    { char:"🪣", name:"bucket", kw:["bucket","water","carry","mop","clean"] },
    { char:"🧴", name:"lotion_bottle", kw:["lotion","bottle","cream","skin","moisturizer"] },
    { char:"🧷", name:"safety_pin", kw:["safety_pin","pin","secure","sewing","sharp"] },
    { char:"🧹", name:"broom", kw:["broom","sweep","clean","witch","fly"] },
    { char:"🧺", name:"basket", kw:["basket","laundry","storage","weave","carry"] },
    { char:"🧻", name:"roll_of_paper", kw:["toilet_paper","tissue","roll","paper","wipe"] },
    { char:"🪣", name:"plunger", kw:["plunger","toilet","clog","plumber","fix"] },
    { char:"🪠", name:"plunger_v2", kw:["plunger","drain","fix","toilet","clog"] },
    { char:"🧹", name:"cleaning_broom", kw:["broom","clean","sweep","dust","witch"] },
    { char:"🚿", name:"shower", kw:["shower","clean","bath","water","refresh"] },
    { char:"🛁", name:"bathtub", kw:["bathtub","bath","relax","soak","clean"] },
    { char:"🛒", name:"shopping_cart", kw:["cart","shopping","grocery","buy","wheel"] },
    { char:"🚪", name:"door", kw:["door","open","close","enter","knock"] },
    { char:"🪑", name:"chair", kw:["chair","sit","furniture","seat","stool"] },
    { char:"🪞", name:"mirror", kw:["mirror","reflect","look","beauty","vanity"] },
    { char:"🛋️", name:"couch_and_lamp", kw:["couch","sofa","lamp","living_room","relax"] },
    { char:"🛏️", name:"bed", kw:["bed","sleep","night","rest","furniture"] },
    { char:"🧸", name:"plush_teddy", kw:["teddy","plush","toy","soft","bear"] },
    { char:"📿", name:"prayer_beads", kw:["beads","prayer","rosary","meditation","religion"] },
    { char:"💎", name:"gem_stone", kw:["diamond","gem","ruby","jewel","precious"] },
    { char:"👑", name:"crown", kw:["crown","king","queen","royal","winner"] },
    { char:"💍", name:"ring", kw:["ring","marriage","proposal","engagement","diamond"] },
    { char:"👛", name:"purse", kw:["purse","bag","money","fashion","wallet"] },
    { char:"👜", name:"handbag", kw:["handbag","bag","fashion","purse","accessories"] },
    { char:"💼", name:"briefcase", kw:["briefcase","work","business","office","bag"] },
    { char:"🎒", name:"backpack", kw:["backpack","school","travel","bag","hike"] },
    { char:"👓", name:"glasses", kw:["glasses","eyeglasses","see","vision","nerd"] },
    { char:"🕶️", name:"sunglasses", kw:["sunglasses","cool","sun","shade","celebrity"] },
    { char:"🥽", name:"goggles", kw:["goggles","eye","protect","dive","ski"] },
    { char:"🌂", name:"closed_umbrella", kw:["umbrella","rain","closed","weather"] },
    { char:"☂️", name:"umbrella", kw:["umbrella","rain","open","wet","cover"] },
    { char:"🎃", name:"jack_o_lantern", kw:["pumpkin","halloween","spooky","october","carve"] },
    { char:"🎄", name:"christmas_tree", kw:["christmas","tree","holiday","xmas","december"] },
    { char:"🎋", name:"tanabata_tree", kw:["bamboo","tanabata","japan","summer","wish"] },
    { char:"🎍", name:"pine_decoration", kw:["pine","kadomatsu","japan","new_year","decoration"] },
    { char:"🎎", name:"japanese_dolls", kw:["dolls","hina_matsuri","japan","festival","pair"] },
    { char:"🧧", name:"red_envelope", kw:["red_envelope","hongbao","lucky","money","chinese_new_year"] },
    { char:"🎐", name:"wind_chime", kw:["wind_chime","summer","japan","breeze","clink"] },
    { char:"🎑", name:"moon_viewing_ceremony", kw:["moon","tsukimi","japan","autumn","celebration"] },
    { char:"🧨", name:"firecracker", kw:["firecracker","bang","celebrate","red","new_year"] }
  ],
  "Symbols": [
    { char:"❤️", name:"heart", kw:["love","heart","red","like","passion"] },
    { char:"🧡", name:"orange_heart", kw:["love","heart","orange","warm"] },
    { char:"💛", name:"yellow_heart", kw:["love","heart","yellow","happy"] },
    { char:"💚", name:"green_heart", kw:["love","heart","green","nature"] },
    { char:"💙", name:"blue_heart", kw:["love","heart","blue","calm"] },
    { char:"💜", name:"purple_heart", kw:["love","heart","purple","military"] },
    { char:"🖤", name:"black_heart", kw:["love","heart","black","dark","emo"] },
    { char:"🤍", name:"white_heart", kw:["love","heart","white","pure","innocent"] },
    { char:"🤎", name:"brown_heart", kw:["love","heart","brown","warm"] },
    { char:"❣️", name:"heart_exclamation", kw:["heart","exclamation","love","point"] },
    { char:"❤️‍🔥", name:"heart_on_fire", kw:["passion","love","fire","intense","burn"] },
    { char:"❤️‍🩹", name:"mending_heart", kw:["heal","heart","mend","repair","broken"] },
    { char:"💕", name:"two_hearts", kw:["love","hearts","two","couple","romantic"] },
    { char:"💞", name:"revolving_hearts", kw:["hearts","spinning","love","couple","romantic"] },
    { char:"💓", name:"beating_heart", kw:["heart","beat","love","pulse","throb"] },
    { char:"💗", name:"growing_heart", kw:["heart","grow","love","pink","getting_bigger"] },
    { char:"💖", name:"sparkling_heart", kw:["heart","sparkle","love","pink","shine"] },
    { char:"💘", name:"heart_with_arrow", kw:["heart","arrow","love","cupid","valentines"] },
    { char:"💝", name:"heart_with_ribbon", kw:["heart","ribbon","gift","love","valentines"] },
    { char:"♾️", name:"infinity", kw:["infinity","infinite","loop","forever","math"] },
    { char:"✳️", name:"eight_spoked_asterisk", kw:["asterisk","star","sparkle","eight_pointed"] },
    { char:"✴️", name:"eight_pointed_star", kw:["star","sparkle","eight","orange"] },
    { char:"❇️", name:"sparkle", kw:["sparkle","shine","star","glint"] },
    { char:"🔰", name:"japanese_symbol_for_beginner", kw:["beginner","japan","newbie","green","symbol"] },
    { char:"♻️", name:"recycling_symbol", kw:["recycle","green","eco","loop","environment"] },
    { char:"✅", name:"check_mark_button", kw:["check","done","tick","yes","green","ok"] },
    { char:"☑️", name:"check_box_with_check", kw:["checkbox","check","tick","done","mark"] },
    { char:"🔘", name:"radio_button", kw:["radio","button","select","circle","ui"] },
    { char:"🔲", name:"black_square_button", kw:["square","button","black","ui"] },
    { char:"🔳", name:"white_square_button", kw:["square","button","white","ui"] },
    { char:"⬛", name:"black_large_square", kw:["square","black","block"] },
    { char:"⬜", name:"white_large_square", kw:["square","white","block"] },
    { char:"◼️", name:"black_medium_square", kw:["square","black","medium"] },
    { char:"◻️", name:"white_medium_square", kw:["square","white","medium"] },
    { char:"◾", name:"black_medium_small_square", kw:["square","black","small"] },
    { char:"◽", name:"white_medium_small_square", kw:["square","white","small"] },
    { char:"▪️", name:"black_small_square", kw:["square","black","tiny"] },
    { char:"▫️", name:"white_small_square", kw:["square","white","tiny"] },
    { char:"🔶", name:"large_orange_diamond", kw:["orange","diamond","shape","large"] },
    { char:"🔷", name:"large_blue_diamond", kw:["blue","diamond","shape","large"] },
    { char:"🔸", name:"small_orange_diamond", kw:["orange","diamond","small","shape"] },
    { char:"🔹", name:"small_blue_diamond", kw:["blue","diamond","small","shape"] },
    { char:"🔺", name:"red_triangle_up", kw:["triangle","red","up","warning"] },
    { char:"🔻", name:"red_triangle_down", kw:["triangle","red","down","inverse"] },
    { char:"💠", name:"diamond_with_a_dot", kw:["diamond","blue","dot","shape","rhombus"] },
    { char:"🔷", name:"blue_diamond_large", kw:["diamond","blue","big","shape"] },
    { char:"🔵", name:"blue_circle", kw:["blue","circle","dot","bubble"] },
    { char:"🟤", name:"brown_circle", kw:["brown","circle","dot","chocolate"] },
    { char:"⚫", name:"black_circle", kw:["black","circle","dot","empty"] },
    { char:"⚪", name:"white_circle", kw:["white","circle","dot","blank"] },
    { char:"🟣", name:"purple_circle", kw:["purple","circle","dot","violet"] },
    { char:"🔴", name:"red_circle", kw:["red","circle","dot","stop","record"] },
    { char:"🟠", name:"orange_circle", kw:["orange","circle","dot","warm"] },
    { char:"🟡", name:"yellow_circle", kw:["yellow","circle","dot","sun","happy"] },
    { char:"🟢", name:"green_circle", kw:["green","circle","dot","go","online"] },
    { char:"🔞", name:"no_one_under_eighteen", kw:["adult","18+","prohibited","mature"] },
    { char:"❌", name:"cross_mark", kw:["x","cross","no","wrong","error","cancel"] },
    { char:"⭕", name:"hollow_red_circle", kw:["circle","o","correct","japan","hollow"] },
    { char:"🛑", name:"stop_sign_symbol", kw:["stop","sign","octagon","red","warning"] },
    { char:"⛔", name:"no_entry", kw:["no","entry","prohibited","stop","circle"] },
    { char:"📛", name:"name_badge", kw:["name","badge","tag","id","hello"] },
    { char:"🚫", name:"prohibited", kw:["no","prohibited","banned","circle","forbidden"] },
    { char:"💯", name:"hundred_points_symbol", kw:["100","perfect","score","all","full"] },
    { char:"💢", name:"anger_symbol", kw:["anger","mad","comic","red","symbol"] },
    { char:"♨️", name:"hot_springs", kw:["hot","spring","steam","onsen","japan"] },
    { char:"🚷", name:"no_pedestrians", kw:["no","pedestrian","prohibited","sign","walk"] },
    { char:"🔞", name:"no_under_18", kw:["adult","prohibited","mature","18+","age"] },
    { char:"🔕", name:"bell_with_slash", kw:["mute","silent","no_bell","off","quiet"] },
    { char:"🎵", name:"musical_note", kw:["music","note","song","tune","melody"] },
    { char:"🎶", name:"musical_notes", kw:["music","notes","song","tune","melody"] },
    { char:"🎼", name:"musical_score_symbol", kw:["music","score","sheet","notes","staff"] },
    { char:"📣", name:"megaphone", kw:["megaphone","loud","announce","shout","amplify"] },
    { char:"📢", name:"loudspeaker", kw:["speaker","loud","announce","broadcast","public"] },
    { char:"🔔", name:"bell", kw:["bell","ring","notification","alert","sound"] },
    { char:"🔕", name:"bell_off", kw:["bell","silent","mute","no_sound","quiet"] },
    { char:"📯", name:"postal_horn", kw:["horn","bugle","post","announce","ancient"] },
    { char:"🃏", name:"joker", kw:["joker","card","wild","clown","playing"] },
    { char:"🀄", name:"mahjong_red_dragon", kw:["mahjong","game","tile","chinese","dragon"] },
    { char:"🎴", name:"flower_playing_cards", kw:["cards","flower","hanafuda","japanese","game"] },
    { char:"🔇", name:"muted_speaker", kw:["mute","speaker","silent","off","quiet"] },
    { char:"🔈", name:"speaker_low_volume", kw:["speaker","low","quiet","audio","sound"] },
    { char:"🔉", name:"speaker_medium_volume", kw:["speaker","medium","audio","sound","volume"] },
    { char:"🔊", name:"speaker_high_volume", kw:["speaker","loud","audio","sound","blast"] },
    { char:"📡", name:"satellite_antenna", kw:["satellite","antenna","signal","receive","broadcast"] },
    { char:"🔋", name:"battery", kw:["battery","charge","power","energy","electric"] },
    { char:"🪫", name:"low_battery", kw:["battery","low","empty","dying","drain"] },
    { char:"🔌", name:"electric_plug", kw:["plug","electric","power","charge","socket"] },
    { char:"💡", name:"light_bulb_symbol", kw:["idea","bulb","light","bright","smart"] },
    { char:"🔦", name:"torch", kw:["flashlight","torch","beam","light","dark"] },
    { char:"🕯️", name:"candle_symbol", kw:["candle","flame","wax","light","romance"] },
    { char:"🧭", name:"compass", kw:["compass","navigate","direction","north","explore"] },
    { char:"⏰", name:"alarm_clock", kw:["alarm","clock","wake","morning","ring"] },
    { char:"⌛", name:"hourglass_done", kw:["hourglass","time","sand","done","wait"] },
    { char:"⏳", name:"hourglass_not_done", kw:["hourglass","time","sand","loading","wait"] },
    { char:"⌚", name:"watch_symbol", kw:["watch","time","wrist","clock","hours"] },
    { char:"🕰️", name:"mantelpiece_clock", kw:["clock","mantle","old","time","antique"] },
    { char:"🌐", name:"globe_with_meridians", kw:["globe","world","internet","web","global"] },
    { char:"🗺️", name:"world_map", kw:["map","world","globe","geography","travel"] },
    { char:"🧿", name:"nazar_amulet", kw:["evil_eye","nazar","protection","amulet","bead","blue"] },
    { char:"🪬", name:"hamsa", kw:["hamsa","hand","protection","evil_eye","amulet"] },
    { char:"♠️", name:"spade_suit", kw:["spade","card","suit","black","poker"] },
    { char:"♣️", name:"club_suit", kw:["club","card","suit","black","poker"] },
    { char:"♥️", name:"heart_suit", kw:["heart","card","suit","red","poker"] },
    { char:"♦️", name:"diamond_suit", kw:["diamond","card","suit","red","poker"] },
    { char:"🃏", name:"playing_card_joker", kw:["joker","card","wild","clown","poker"] },
    { char:"♟️", name:"chess_piece", kw:["chess","pawn","game","strategy","board"] },
    { char:"🎰", name:"slot_machine", kw:["slots","casino","jackpot","luck","gamble"] }
  ],
  "Flags": [
    { char:"🏳️", name:"white_flag", kw:["white","flag","surrender","peace","blank"] },
    { char:"🏴", name:"black_flag", kw:["black","flag","pirate","surrender","dark"] },
    { char:"🏁", name:"chequered_flag", kw:["race","finish","flag","chequered","checkered","win"] },
    { char:"🚩", name:"triangular_flag", kw:["red","flag","warning","alert","triangle"] },
    { char:"🏴‍☠️", name:"pirate_flag", kw:["pirate","skull","flag","jolly_roger","crossbones"] },
    { char:"🏳️‍🌈", name:"rainbow_flag", kw:["pride","rainbow","lgbt","gay","equality","flag"] },
    { char:"🏳️‍⚧️", name:"transgender_flag", kw:["transgender","pride","flag","trans","equality"] },
    { char:"🇺🇸", name:"flag_united_states", kw:["usa","america","flag","stars","stripes"] },
    { char:"🇬🇧", name:"flag_united_kingdom", kw:["uk","britain","england","flag","union_jack"] },
    { char:"🇨🇦", name:"flag_canada", kw:["canada","maple","flag","red","white"] },
    { char:"🇦🇺", name:"flag_australia", kw:["australia","flag","southern_cross","down_under"] },
    { char:"🇩🇪", name:"flag_germany", kw:["germany","deutschland","flag","black_red_gold"] },
    { char:"🇫🇷", name:"flag_france", kw:["france","french","flag","tricolore","blue_white_red"] },
    { char:"🇯🇵", name:"flag_japan", kw:["japan","japanese","flag","red_circle","rising_sun"] },
    { char:"🇨🇳", name:"flag_china", kw:["china","chinese","flag","red_star","prc"] },
    { char:"🇧🇷", name:"flag_brazil", kw:["brazil","brasil","flag","green_yellow","samba"] },
    { char:"🇮🇳", name:"flag_india", kw:["india","indian","flag","tricolor","chakra"] },
    { char:"🇮🇹", name:"flag_italy", kw:["italy","italian","flag","green_white_red","boot"] },
    { char:"🇪🇸", name:"flag_spain", kw:["spain","spanish","flag","red_yellow","bull"] },
    { char:"🇲🇽", name:"flag_mexico", kw:["mexico","mexican","flag","eagle","green_white_red"] },
    { char:"🇷🇺", name:"flag_russia", kw:["russia","russian","flag","tricolor","bear"] },
    { char:"🇰🇷", name:"flag_south_korea", kw:["korea","korean","flag","taegukgi","kpop"] },
    { char:"🇿🇦", name:"flag_south_africa", kw:["south_africa","flag","rainbow","mandela","colorful"] },
    { char:"🇳🇬", name:"flag_nigeria", kw:["nigeria","nigerian","flag","green_white","africa"] },
    { char:"🇦🇷", name:"flag_argentina", kw:["argentina","argentinian","flag","blue_white","sun"] },
    { char:"🇵🇹", name:"flag_portugal", kw:["portugal","portuguese","flag","green_red","armillary"] },
    { char:"🇬🇷", name:"flag_greece", kw:["greece","greek","flag","blue_white","cross","sea"] },
    { char:"🇸🇪", name:"flag_sweden", kw:["sweden","swedish","flag","blue_yellow","nordic"] },
    { char:"🇳🇴", name:"flag_norway", kw:["norway","norwegian","flag","blue_red_white","nordic"] },
    { char:"🇮🇪", name:"flag_ireland", kw:["ireland","irish","flag","green_white_orange","shamrock"] },
    { char:"🇨🇭", name:"flag_switzerland", kw:["switzerland","swiss","flag","red_white","cross","neutral"] },
    { char:"🇳🇱", name:"flag_netherlands", kw:["netherlands","dutch","flag","red_white_blue","orange"] },
    { char:"🇧🇪", name:"flag_belgium", kw:["belgium","belgian","flag","black_yellow_red","chocolate"] },
    { char:"🇦🇹", name:"flag_austria", kw:["austria","austrian","flag","red_white_red","mountains"] },
    { char:"🇵🇱", name:"flag_poland", kw:["poland","polish","flag","white_red","eagle"] },
    { char:"🇺🇦", name:"flag_ukraine", kw:["ukraine","ukrainian","flag","blue_yellow","sunflower","peace"] },
    { char:"🇹🇷", name:"flag_turkey", kw:["turkey","turkish","flag","red","crescent","star"] },
    { char:"🇸🇦", name:"flag_saudi_arabia", kw:["saudi","arabia","flag","green","sword","shahada"] },
    { char:"🇮🇱", name:"flag_israel", kw:["israel","flag","blue_white","star_of_david","magen"] },
    { char:"🇪🇬", name:"flag_egypt", kw:["egypt","egyptian","flag","red_white_black","eagle","pharaoh"] },
    { char:"🇵🇭", name:"flag_philippines", kw:["philippines","filipino","flag","blue_red_white","sun","stars"] },
    { char:"🇻🇳", name:"flag_vietnam", kw:["vietnam","vietnamese","flag","red_star","pho"] },
    { char:"🇮🇩", name:"flag_indonesia", kw:["indonesia","indonesian","flag","red_white","bendera"] },
    { char:"🇲🇾", name:"flag_malaysia", kw:["malaysia","malaysian","flag","red_white","moon","star"] },
    { char:"🇹🇭", name:"flag_thailand", kw:["thailand","thai","flag","red_white_blue","elephant"] },
    { char:"🇵🇰", name:"flag_pakistan", kw:["pakistan","pakistani","flag","green_white","crescent","star"] },
    { char:"🇧🇩", name:"flag_bangladesh", kw:["bangladesh","bangladeshi","flag","green_red_circle"] },
    { char:"🇪🇹", name:"flag_ethiopia", kw:["ethiopia","ethiopian","flag","green_yellow_red","star"] },
    { char:"🇨🇴", name:"flag_colombia", kw:["colombia","colombian","flag","yellow_blue_red","coffee"] },
    { char:"🇨🇱", name:"flag_chile", kw:["chile","chilean","flag","red_white_blue","star"] },
    { char:"🇵🇪", name:"flag_peru", kw:["peru","peruvian","flag","red_white","machu_picchu"] }
  ]
};

/* Flatten for search */
const FLAT_EMOJIS = [];
for (const [category, emojis] of Object.entries(EMOJI_DATA)) {
  for (const e of emojis) {
    FLAT_EMOJIS.push({ ...e, category });
  }
}

/* Skin tone modifier map */
const SKIN_TONES = [
  { name: 'default', modifier: '', label: '🖐️' },
  { name: 'light',   modifier: '\u{1F3FB}', label: '🖐🏻' },
  { name: 'medium-light', modifier: '\u{1F3FC}', label: '🖐🏼' },
  { name: 'medium',  modifier: '\u{1F3FD}', label: '🖐🏽' },
  { name: 'medium-dark', modifier: '\u{1F3FE}', label: '🖐🏾' },
  { name: 'dark',    modifier: '\u{1F3FF}', label: '🖐🏿' }
];

/* =======================
   EVENT EMITTER
   ======================= */
class EventEmitter {
  constructor() { this._events = {}; }
  on(event, handler) {
    (this._events[event] = this._events[event] || []).push(handler);
    return this;
  }
  off(event, handler) {
    if (this._events[event]) this._events[event] = this._events[event].filter(h => h !== handler);
    return this;
  }
  emit(event, ...args) {
    (this._events[event] || []).forEach(h => h(...args));
    return this;
  }
}

/* =======================
   EMOJI PICKER CLASS
   ======================= */
class EmojiPicker extends EventEmitter {

  static _instances = [];
  static _defaultOptions = {
    theme: 'auto',
    mode: 'dropdown',
    search: true,
    recentEmojis: true,
    maxRecent: 24,
    skinTone: 'default',
    customEmojis: [],
    container: null,
    locale: 'en',
    perRow: 8,
    emojiSize: 28,
    showVariants: true,
    autoClose: true,
  };

  constructor(opts = {}) {
    super();
    this.options = { ...EmojiPicker._defaultOptions, ...opts };
    this._open = false;
    this._currentCategory = 'recent';
    this._searchQuery = '';
    this._currentSkinTone = SKIN_TONES.find(s => s.name === this.options.skinTone) || SKIN_TONES[0];
    this._triggerEl = null;
    this._pickerEl = null;
    this._focusedIndex = -1;
    this._init();
    EmojiPicker._instances.push(this);
  }

  /* ---- Internal Init ---- */
  _init() {
    if (this.options.container) {
      const el = typeof this.options.container === 'string'
        ? document.querySelector(this.options.container)
        : this.options.container;
      if (el) {
        this._triggerEl = el;
        el.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); });
      }
    }

    // Global click to close dropdown
    document.addEventListener('click', (e) => {
      if (this._open && this._pickerEl && !this._pickerEl.contains(e.target)) {
        if (!this._triggerEl || !this._triggerEl.contains(e.target)) this.close();
      }
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!this._open) return;
      if (e.key === 'Escape') { this.close(); return; }
    });

    if (this.options.mode === 'inline') {
      this._renderPicker();
      this._open = true;
    }
  }

  /* ---- Render Picker ---- */
  _renderPicker() {
    if (this._pickerEl) this._pickerEl.remove();

    const isDark = this.options.theme === 'dark' ||
      (this.options.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const el = document.createElement('div');
    el.className = 'ep-picker' + (isDark ? ' ep-dark' : ' ep-light');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Emoji Picker');
    el.addEventListener('click', e => e.stopPropagation());

    if (this.options.mode === 'inline') {
      el.classList.add('ep-inline');
      const container = typeof this.options.container === 'string'
        ? document.querySelector(this.options.container)
        : this.options.container;
      if (container) { container.appendChild(el); }
      else { document.body.appendChild(el); }
    } else {
      el.classList.add('ep-floating');
      document.body.appendChild(el);
    }

    el.innerHTML = this._buildPickerHTML();
    this._pickerEl = el;
    this._attachPickerEvents();
    this._loadCategory(this._currentCategory);
    this._positionPicker();
  }

  _buildPickerHTML() {
    const categories = ['recent', ...Object.keys(EMOJI_DATA)];
    const catIcons = {
      recent: '🕐', 'Smileys & Emotion': '😊', 'People & Body': '👋',
      'Animals & Nature': '🐶', 'Food & Drink': '🍕', 'Activities': '⚽',
      'Travel & Places': '✈️', 'Objects': '💡', 'Symbols': '❤️', 'Flags': '🏳️'
    };

    const hasCustom = this.options.customEmojis && this.options.customEmojis.length;
    if (hasCustom) categories.push('custom');

    const catTabs = categories.map((cat, i) => `
      <button class="ep-cat-tab ${i === 0 ? 'ep-active' : ''}" 
        data-category="${cat}" 
        aria-label="${cat}" 
        title="${cat}"
        tabindex="0">
        ${catIcons[cat] || '✨'}
      </button>
    `).join('');

    const skinToneBtns = SKIN_TONES.map(t => `
      <button class="ep-skin-btn ${t.name === this._currentSkinTone.name ? 'ep-active' : ''}"
        data-skin="${t.name}" title="${t.name}" aria-label="Skin tone: ${t.name}">
        <span style="font-size:16px">${t.label}</span>
      </button>
    `).join('');

    return `
      <div class="ep-inner">
        ${this.options.search ? `
          <div class="ep-search-row">
            <div class="ep-search-wrap">
              <svg class="ep-search-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14 14l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input type="text" class="ep-search" placeholder="Search emoji..." 
                aria-label="Search emoji" autocomplete="off" spellcheck="false">
              <button class="ep-search-clear" aria-label="Clear search" style="display:none">✕</button>
            </div>
          </div>
        ` : ''}
        <div class="ep-cats" role="tablist" aria-label="Emoji categories">${catTabs}</div>
        <div class="ep-category-label"></div>
        <div class="ep-grid-wrap">
          <div class="ep-grid" role="grid" aria-label="Emoji grid"></div>
        </div>
        <div class="ep-footer">
          <div class="ep-skin-tones" aria-label="Select skin tone">
            ${skinToneBtns}
          </div>
          <div class="ep-preview" aria-live="polite">
            <span class="ep-preview-char"></span>
            <span class="ep-preview-name"></span>
          </div>
        </div>
      </div>
    `;
  }

  _attachPickerEvents() {
    const el = this._pickerEl;

    // Search
    if (this.options.search) {
      const searchInput = el.querySelector('.ep-search');
      const clearBtn = el.querySelector('.ep-search-clear');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this._searchQuery = e.target.value.trim();
          if (clearBtn) clearBtn.style.display = this._searchQuery ? 'flex' : 'none';
          if (this._searchQuery) {
            this._loadSearch(this._searchQuery);
            this.emit('search', { query: this._searchQuery });
          } else {
            this._loadCategory(this._currentCategory);
          }
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          this._searchQuery = '';
          clearBtn.style.display = 'none';
          this._loadCategory(this._currentCategory);
          searchInput.focus();
        });
      }
    }

    // Category tabs
    el.querySelectorAll('.ep-cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.dataset.category;
        this._setActiveTab(cat);
        this._currentCategory = cat;
        if (this.options.search) {
          const searchInput = el.querySelector('.ep-search');
          if (searchInput) searchInput.value = '';
          const clearBtn = el.querySelector('.ep-search-clear');
          if (clearBtn) clearBtn.style.display = 'none';
          this._searchQuery = '';
        }
        this._loadCategory(cat);
        this.emit('categoryChange', { category: cat });
      });
    });

    // Skin tones
    el.querySelectorAll('.ep-skin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const skinName = btn.dataset.skin;
        this._currentSkinTone = SKIN_TONES.find(s => s.name === skinName) || SKIN_TONES[0];
        el.querySelectorAll('.ep-skin-btn').forEach(b => b.classList.remove('ep-active'));
        btn.classList.add('ep-active');
        this._loadCategory(this._currentCategory);
      });
    });

    // Emoji grid events (delegated)
    const grid = el.querySelector('.ep-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const cell = e.target.closest('.ep-emoji-btn');
        if (!cell) return;
        const emojiData = JSON.parse(cell.dataset.emoji);
        this._handleEmojiClick(emojiData, e);
      });

      grid.addEventListener('mouseover', (e) => {
        const cell = e.target.closest('.ep-emoji-btn');
        if (!cell) return;
        const emojiData = JSON.parse(cell.dataset.emoji);
        const previewChar = el.querySelector('.ep-preview-char');
        const previewName = el.querySelector('.ep-preview-name');
        if (previewChar) previewChar.textContent = emojiData.char;
        if (previewName) previewName.textContent = emojiData.name.replace(/_/g, ' ');
        this.emit('emojiHover', emojiData, e);
      });

      grid.addEventListener('mouseout', () => {
        const previewChar = el.querySelector('.ep-preview-char');
        const previewName = el.querySelector('.ep-preview-name');
        if (previewChar) previewChar.textContent = '';
        if (previewName) previewName.textContent = '';
      });
    }
  }

  _handleEmojiClick(emojiData, event) {
    this._addToRecent(emojiData);
    // animate
    const cell = this._pickerEl && this._pickerEl.querySelector(`[data-emoji='${JSON.stringify(emojiData).replace(/'/g, "\\'")}']`);
    if (cell) {
      cell.classList.add('ep-pop');
      setTimeout(() => cell.classList.remove('ep-pop'), 300);
    }
    this.emit('emojiClick', emojiData, event);
    if (this.options.autoClose && this.options.mode !== 'inline') {
      this.close();
    }
  }

  _loadCategory(cat) {
    const grid = this._pickerEl && this._pickerEl.querySelector('.ep-grid');
    const label = this._pickerEl && this._pickerEl.querySelector('.ep-category-label');
    if (!grid) return;

    let emojis = [];
    if (cat === 'recent') {
      emojis = this._getRecentEmojis();
      if (label) label.textContent = emojis.length ? 'Recently Used' : 'No recent emojis yet';
    } else if (cat === 'custom') {
      emojis = (this.options.customEmojis || []).map(c => ({
        char: null, name: c.name, category: 'custom', unicode: null, isCustom: true, url: c.url
      }));
      if (label) label.textContent = 'Custom';
    } else {
      emojis = (EMOJI_DATA[cat] || []).map(e => ({
        ...e, category: cat,
        char: this._applySkinTone(e)
      }));
      if (label) label.textContent = cat;
    }

    grid.innerHTML = '';
    if (emojis.length === 0) {
      grid.innerHTML = '<div class="ep-empty">No emojis found</div>';
      return;
    }
    grid.appendChild(this._buildEmojiFragment(emojis));
  }

  _loadSearch(query) {
    const grid = this._pickerEl && this._pickerEl.querySelector('.ep-grid');
    const label = this._pickerEl && this._pickerEl.querySelector('.ep-category-label');
    if (!grid) return;

    const q = query.toLowerCase();
    const results = FLAT_EMOJIS.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.name.replace(/_/g,' ').toLowerCase().includes(q) ||
      (e.kw && e.kw.some(k => k.toLowerCase().includes(q)))
    ).slice(0, 60).map(e => ({
      ...e,
      char: this._applySkinTone(e)
    }));

    if (label) label.textContent = `Results for "${query}"`;
    grid.innerHTML = '';
    if (!results.length) {
      grid.innerHTML = `<div class="ep-empty">No results for "${query}"</div>`;
      return;
    }
    grid.appendChild(this._buildEmojiFragment(results));
  }

  _buildEmojiFragment(emojis) {
    const frag = document.createDocumentFragment();
    for (const e of emojis) {
      const btn = document.createElement('button');
      btn.className = 'ep-emoji-btn';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', e.name.replace(/_/g,' '));
      btn.setAttribute('title', e.name.replace(/_/g,' '));
      const dataObj = {
        char: e.char,
        name: e.name,
        category: e.category,
        unicode: e.unicode || (e.char ? e.char.codePointAt(0).toString(16).toUpperCase() : null),
        skinTone: this._currentSkinTone.name === 'default' ? null : this._currentSkinTone.name,
        isCustom: e.isCustom || false
      };
      btn.dataset.emoji = JSON.stringify(dataObj);
      if (e.isCustom) {
        const img = document.createElement('img');
        img.src = e.url;
        img.alt = e.name;
        img.style.cssText = 'width:var(--ep-size,28px);height:var(--ep-size,28px);object-fit:contain';
        btn.appendChild(img);
      } else {
        btn.textContent = e.char;
      }
      frag.appendChild(btn);
    }
    return frag;
  }

  _applySkinTone(e) {
    if (!e.skinnable || this._currentSkinTone.name === 'default') return e.char;
    const modifier = this._currentSkinTone.modifier;
    // Insert modifier after base emoji (before ZWJ or variation selector if present)
    const base = e.char;
    // Handle ZWJ sequences – just prepend modifier after first codepoint
    const cp = [...base];
    if (cp.length > 0) return cp[0] + modifier + cp.slice(1).join('');
    return base;
  }

  _setActiveTab(cat) {
    if (!this._pickerEl) return;
    this._pickerEl.querySelectorAll('.ep-cat-tab').forEach(t => {
      t.classList.toggle('ep-active', t.dataset.category === cat);
    });
  }

  _positionPicker() {
    if (!this._pickerEl || this.options.mode === 'inline') return;
    const el = this._pickerEl;

    if (!this._triggerEl) {
      el.style.cssText += ';position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)';
      return;
    }

    const rect = this._triggerEl.getBoundingClientRect();
    const ph = el.offsetHeight || 440;
    const pw = el.offsetWidth || 340;
    const vw = window.innerWidth, vh = window.innerHeight;

    let top = rect.bottom + 8;
    let left = rect.left;

    if (top + ph > vh) top = rect.top - ph - 8;
    if (left + pw > vw) left = vw - pw - 8;
    if (left < 8) left = 8;
    if (top < 8) top = 8;

    el.style.cssText += `;position:fixed;top:${top}px;left:${left}px`;
  }

  /* ---- Recent Emojis ---- */
  _getRecentEmojis() {
    if (!this.options.recentEmojis) return [];
    try {
      const stored = localStorage.getItem('ep_recent');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  }

  _addToRecent(emojiData) {
    if (!this.options.recentEmojis || emojiData.isCustom) return;
    try {
      let recent = this._getRecentEmojis();
      recent = [emojiData, ...recent.filter(e => e.name !== emojiData.name)];
      recent = recent.slice(0, this.options.maxRecent);
      localStorage.setItem('ep_recent', JSON.stringify(recent));
    } catch {}
  }

  /* ---- Public API ---- */
  open() {
    if (this._open) return this;
    this._open = true;
    if (!this._pickerEl) this._renderPicker();
    this._pickerEl.classList.add('ep-visible');
    this._pickerEl.style.display = '';
    // Load recent or first category
    if (this._getRecentEmojis().length > 0) {
      this._currentCategory = 'recent';
    } else {
      this._currentCategory = 'Smileys & Emotion';
      this._setActiveTab(this._currentCategory);
    }
    this._loadCategory(this._currentCategory);
    this._positionPicker();
    this.emit('pickerOpen');
    // Focus search if available
    if (this.options.search) {
      setTimeout(() => {
        const s = this._pickerEl && this._pickerEl.querySelector('.ep-search');
        if (s) s.focus();
      }, 50);
    }
    return this;
  }

  close() {
    if (!this._open) return this;
    this._open = false;
    if (this._pickerEl) {
      this._pickerEl.classList.remove('ep-visible');
    }
    this.emit('pickerClose');
    return this;
  }

  toggle() {
    return this._open ? this.close() : this.open();
  }

  destroy() {
    if (this._pickerEl) { this._pickerEl.remove(); this._pickerEl = null; }
    this._events = {};
    const idx = EmojiPicker._instances.indexOf(this);
    if (idx > -1) EmojiPicker._instances.splice(idx, 1);
  }

  setTheme(theme) {
    this.options.theme = theme;
    if (this._pickerEl) {
      this._pickerEl.classList.remove('ep-dark', 'ep-light');
      const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      this._pickerEl.classList.add(isDark ? 'ep-dark' : 'ep-light');
    }
    return this;
  }

  /* ---- Static Helper ---- */
  static attachToInput(selector, opts = {}) {
    const input = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!input) return null;
    const wrapper = document.createElement('span');
    wrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const triggerBtn = document.createElement('button');
    triggerBtn.textContent = '😊';
    triggerBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:22px;padding:4px;line-height:1;border-radius:6px;transition:transform 0.15s;';
    triggerBtn.onmouseenter = () => triggerBtn.style.transform = 'scale(1.2)';
    triggerBtn.onmouseleave = () => triggerBtn.style.transform = 'scale(1)';
    wrapper.appendChild(triggerBtn);

    const picker = new EmojiPicker({ container: triggerBtn, mode: 'dropdown', ...opts });
    picker.on('emojiClick', (emoji) => {
      const pos = input.selectionStart || input.value.length;
      const before = input.value.substring(0, pos);
      const after = input.value.substring(input.selectionEnd || pos);
      input.value = before + emoji.char + after;
      const newPos = pos + emoji.char.length;
      input.setSelectionRange(newPos, newPos);
      input.focus();
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    return picker;
  }
}

/* =======================
   PICKER STYLES
   ======================= */
const STYLES = `
.ep-picker {
  --ep-bg: #1a1d2e;
  --ep-surface: #21253a;
  --ep-surface2: #2a2f47;
  --ep-border: rgba(255,255,255,0.08);
  --ep-text: #e4e7f3;
  --ep-text-dim: #6b738f;
  --ep-accent: #6c63ff;
  --ep-accent-glow: rgba(108,99,255,0.2);
  --ep-hover: rgba(108,99,255,0.12);
  --ep-active-tab: rgba(108,99,255,0.2);
  --ep-size: 28px;
  --ep-radius: 16px;
  --ep-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
  --ep-search-bg: rgba(255,255,255,0.05);
}
.ep-picker.ep-light {
  --ep-bg: #ffffff;
  --ep-surface: #f5f6fa;
  --ep-surface2: #edeef5;
  --ep-border: rgba(0,0,0,0.08);
  --ep-text: #1a1d2e;
  --ep-text-dim: #8891ab;
  --ep-accent: #5b52f0;
  --ep-accent-glow: rgba(91,82,240,0.15);
  --ep-hover: rgba(91,82,240,0.08);
  --ep-active-tab: rgba(91,82,240,0.12);
  --ep-search-bg: rgba(0,0,0,0.04);
  --ep-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06);
}
.ep-picker.ep-floating {
  position: fixed;
  z-index: 99999;
  width: 350px;
  display: none;
  opacity: 0;
  transform: translateY(6px) scale(0.97);
  transition: opacity 0.18s, transform 0.18s;
  will-change: transform, opacity;
}
.ep-picker.ep-floating.ep-visible {
  display: block;
  opacity: 1;
  transform: translateY(0) scale(1);
}
.ep-picker.ep-inline {
  position: relative;
  width: 100%;
}
.ep-inner {
  background: var(--ep-bg);
  border-radius: var(--ep-radius);
  box-shadow: var(--ep-shadow);
  border: 1px solid var(--ep-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ep-search-row {
  padding: 12px 12px 8px;
}
.ep-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.ep-search-icon {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  color: var(--ep-text-dim);
  pointer-events: none;
}
.ep-search {
  width: 100%;
  background: var(--ep-search-bg);
  border: 1px solid var(--ep-border);
  border-radius: 10px;
  color: var(--ep-text);
  font-size: 13px;
  font-family: inherit;
  padding: 8px 32px 8px 32px;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}
.ep-search:focus {
  border-color: var(--ep-accent);
  background: var(--ep-hover);
}
.ep-search::placeholder { color: var(--ep-text-dim); }
.ep-search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--ep-text-dim);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.ep-search-clear:hover { color: var(--ep-text); }

.ep-cats {
  display: flex;
  padding: 0 8px;
  gap: 2px;
  border-bottom: 1px solid var(--ep-border);
  overflow-x: auto;
  scrollbar-width: none;
}
.ep-cats::-webkit-scrollbar { display: none; }
.ep-cat-tab {
  flex: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px 9px;
  border-radius: 8px;
  transition: background 0.12s, transform 0.1s;
  line-height: 1;
  position: relative;
  outline: none;
}
.ep-cat-tab:hover { background: var(--ep-hover); transform: scale(1.1); }
.ep-cat-tab.ep-active {
  background: var(--ep-active-tab);
}
.ep-cat-tab.ep-active::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 50%;
  transform: translateX(-50%);
  width: 4px; height: 4px;
  border-radius: 2px;
  background: var(--ep-accent);
}

.ep-category-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ep-text-dim);
  padding: 8px 14px 4px;
}

.ep-grid-wrap {
  height: 260px;
  overflow-y: auto;
  padding: 4px 8px 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--ep-border) transparent;
}
.ep-grid-wrap::-webkit-scrollbar { width: 4px; }
.ep-grid-wrap::-webkit-scrollbar-thumb {
  background: var(--ep-border);
  border-radius: 2px;
}
.ep-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}
.ep-emoji-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--ep-size);
  line-height: 1;
  padding: 5px;
  border-radius: 8px;
  transition: background 0.1s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  outline: none;
  aspect-ratio: 1;
}
.ep-emoji-btn:hover {
  background: var(--ep-hover);
  transform: scale(1.2);
}
.ep-emoji-btn:active { transform: scale(0.9); }
.ep-emoji-btn.ep-pop {
  animation: ep-pop 0.25s ease;
}
@keyframes ep-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.4); }
  70% { transform: scale(0.85); }
  100% { transform: scale(1); }
}
.ep-empty {
  grid-column: 1 / -1;
  padding: 30px 12px;
  text-align: center;
  color: var(--ep-text-dim);
  font-size: 13px;
}

.ep-footer {
  border-top: 1px solid var(--ep-border);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.ep-skin-tones {
  display: flex;
  gap: 4px;
}
.ep-skin-btn {
  background: none;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  line-height: 1;
  transition: border-color 0.12s, transform 0.1s;
  outline: none;
}
.ep-skin-btn:hover { transform: scale(1.15); border-color: var(--ep-border); }
.ep-skin-btn.ep-active { border-color: var(--ep-accent); }
.ep-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: flex-end;
  min-height: 24px;
}
.ep-preview-char {
  font-size: 22px;
  line-height: 1;
}
.ep-preview-name {
  font-size: 11px;
  color: var(--ep-text-dim);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}
`;

const styleEl = document.createElement('style');
styleEl.textContent = STYLES;
document.head.appendChild(styleEl);

  return EmojiPicker;
}));