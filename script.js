// 전체를 즉시실행함수로 감싸둠. 변수가 밖으로 안 새게 하려고 ㅇㅇ
(function(){
"use strict";

// 학과 이름이랑 부스 이름. 다른 데서 쓸 거면 여기 두 줄만 바꾸면 됨 개꿀
// 바꾸면 푸터랑 결과 복사 문구에 알아서 다 반영됨
var DEPT  = "심리학과";
var BOOTH = "체험 부스";

// 해석자에게 메일 보내는 주소. 구글 Apps Script 웹 앱 URL을 넣으면 됨 (만드는 법은 README 참고)
// 비워 두면 메일 안 보냄
// 받는 사람 메일 주소는 여기 말고 Apps Script(Code.gs) 안에 적음. 그래야 아무 데나 못 보냄
var MAIL_URL = "https://script.google.com/macros/s/AKfycbyPNs8KIbwVZ78vrFg6JbsQXiJaBnZXmec87P0_UHnYF02P5dgIB3AX7pzBsoKK-XN8/exec";

// 문항 데이터 45개
// c는 어느 요소 문항인지 번호임. 0이 친밀감, 1이 열정, 2가 약속·책임감 (15개씩)
// t 안의 {N}은 사람 이름 들어갈 자리. {N:을}처럼 쓰면 받침 보고 을 를 알아서 붙여줌
var ITEMS = [
{c:0,t:"나는 {N}의 행복을 위해 적극 지원한다."},
{c:0,t:"나는 {N:와} 따뜻한 관계를 맺고 있다."},
{c:0,t:"나는 힘들 때, {N}에게 의지할 수 있다."},
{c:0,t:"{N:은} 힘들 때 나에게 의지할 수 있다."},
{c:0,t:"{N:와} 나의 모든 것을 공유할 의향이 있다."},
{c:0,t:"{N:로}부터 상당한 정서적 지지를 받고 있다."},
{c:0,t:"나는 {N}에게 상당한 정서적 지지를 주고 있다."},
{c:0,t:"나는 {N:와} 말이 잘 통한다."},
{c:0,t:"내 인생에서 {N:은} 매우 중요하다."},
{c:0,t:"{N}에게 친밀감을 느낀다."},
{c:0,t:"{N:와}의 관계는 편안하다."},
{c:0,t:"나는 {N:을} 정말 이해하고 있다고 느낀다."},
{c:0,t:"나는 {N:이} 나를 정말 이해하고 있다고 느낀다."},
{c:0,t:"{N:을} 정말 신뢰한다."},
{c:0,t:"나에 관한 매우 개인적인 정보를 {N:와} 공유하고 있다."},
{c:1,t:"{N:을} 보기만 해도 나는 흥분된다."},
{c:1,t:"나는 낮에도 {N:을} 자주 생각한다."},
{c:1,t:"{N:와} 나의 관계는 정말 낭만적이다."},
{c:1,t:"나는 {N:이} 매우 매력 있다고 생각한다."},
{c:1,t:"{N:은} 나의 이상형이다."},
{c:1,t:"{N}만큼 나를 행복하게 해 주는 사람은 없을 것이다."},
{c:1,t:"나는 다른 사람보다도 {N:와} 함께 있고 싶다."},
{c:1,t:"이 세상에서 {N:와}의 관계보다 더 중요한 것은 없다."},
{c:1,t:"나는 {N:와} 신체적 접촉하는 것을 특히 좋아한다."},
{c:1,t:"{N:와}의 관계에는 '마술적'인 면이 있다."},
{c:1,t:"나는 {N:을} 찬미한다."},
{c:1,t:"나는 {N} 없는 인생은 생각할 수 없다."},
{c:1,t:"{N:와} 나의 관계는 열정적이다."},
{c:1,t:"낭만적 영화나 책을 볼 때는 {N:이} 생각난다."},
{c:1,t:"나는 {N}에 대해 공상하곤 한다."},
{c:2,t:"나는 {N}에 대해 염려하고 있다."},
{c:2,t:"{N:와}의 관계를 지속시키기 위해 최선을 다하고 있다."},
{c:2,t:"우리 사이에 타인이 끼어들지 못하게 {N}에게 최선을 다하고 있다."},
{c:2,t:"{N:와}의 관계가 흔들리지 않을 것임을 확신한다."},
{c:2,t:"어떤 난관에도 {N}에게 헌신할 것이다."},
{c:2,t:"{N}에 대한 나의 사랑은 평생 지속될 것이다."},
{c:2,t:"{N:을} 위해 항상 강한 책임감을 느낄 것이다."},
{c:2,t:"{N}에 대한 나의 사랑은 확고하다."},
{c:2,t:"{N:와} 관계가 끝나는 것은 상상도 할 수 없다."},
{c:2,t:"{N}에 대한 나의 사랑을 확신한다."},
{c:2,t:"{N:와}의 관계가 영원히 지속될 것이라고 생각한다."},
{c:2,t:"{N:와} 사귀기로 한 결정은 잘 한 것이다."},
{c:2,t:"{N}에 대한 책임감을 느낀다."},
{c:2,t:"{N:와}의 관계를 지속할 작정이다."},
{c:2,t:"{N:와} 갈등이 생긴다 해도, 우리의 관계를 계속 유지할 것이다."}
];
// 한 페이지에 5문항씩이라 총 9페이지 나옴
var TOTAL = ITEMS.length, PER = 5, PAGES = Math.ceil(TOTAL / PER);
// 평균이 HIGH 이상이면 높음, MID 밑이면 낮음
// 원 척도엔 정해진 컷이 없어서 우리가 임의로 정한 기준임. 바꾸고 싶으면 여기 숫자만 건들면 됨
var HIGH = 5.0, MID = 3.5;

// 세 요소 정보. 이름, 설명, 점수 수준별 해석, 키우는 팁까지 다 여기 들어있음
var COMP = [
{key:"int", name:"친밀감", kw:"따뜻함 · 신뢰 · 소통",
  about:"서로 이해하고 믿으며 편하게 기댈 수 있는 마음의 가까움이에요.",
  ch:{color:"#FF8A3D", eyes:"happy", mouth:"smile", acc:["bubble"]},
  lv:{high:"서로를 깊이 이해하고 믿는, 마음이 아주 가까운 상태예요.",
      mid:"어느 정도 마음을 나누고 있지만, 더 깊이 터놓을 여지가 있어요.",
      low:"아직 마음의 거리가 있는 편이에요. 속마음을 나누는 시간이 필요할 수 있어요."},
  ask:"힘든 일이 생기면 이 사람에게 가장 먼저 이야기하는 편이에요?",
  tips:["하루 10분이라도 휴대폰을 내려놓고 서로의 하루를 묻고 들어 주세요.",
        "고민이나 속마음을 내가 먼저 조금씩 꺼내 보세요. 마음은 주고받으며 가까워져요.",
        "상대의 이야기에 조언이나 판단보다 공감을 먼저 해 주세요."]},
{key:"pas", name:"열정", kw:"설렘 · 매력 · 두근거림",
  about:"보기만 해도 설레는 끌림, 로맨틱한 감정과 신체적 끌림이에요.",
  ch:{color:"#F0457A", eyes:"heart", mouth:"open", acc:["flame"]},
  lv:{high:"상대에게 강한 설렘과 끌림을 느끼고 있어요.",
      mid:"설렘은 있지만 강렬하진 않은, 잔잔한 상태예요.",
      low:"설렘이나 로맨틱한 감정이 약한 편이에요. 오래된 관계라면 자연스러운 변화일 수도 있어요."},
  ask:"요즘도 이 사람을 생각하면 설레요? 처음과 비교하면 어때요?",
  tips:["처음 만났을 때처럼 새로운 장소나 활동을 함께 해 보세요. 새로움은 설렘을 깨워요.",
        "상대의 매력이나 고마운 점을 말로 자주 표현해 보세요.",
        "손잡기, 포옹처럼 작고 다정한 스킨십을 자주 나눠 보세요."]},
{key:"com", name:"약속·책임감", kw:"헌신 · 믿음 · 함께하는 미래",
  about:"이 관계를 지키고 오래 함께하겠다는 결심과 책임감이에요.",
  ch:{color:"#4F6BF0", eyes:"dot", mouth:"smile", acc:["ring"]},
  lv:{high:"어떤 일이 있어도 이 관계를 지키려는 마음이 단단해요.",
      mid:"관계를 이어 가고 싶지만, 확신은 아직 자라는 중이에요.",
      low:"관계의 미래에 대한 확신이나 결심이 아직 약한 편이에요."},
  ask:"이 사람과 함께하는 1년 뒤를 떠올리면 어떤 모습이에요?",
  tips:["함께하고 싶은 가까운 미래(여행, 기념일, 계획)를 구체적으로 이야기해 보세요.",
        "작은 약속부터 꼭 지키며 서로에 대한 믿음을 쌓아 보세요.",
        "갈등이 생기면 누가 옳은지보다 '우리'가 함께 풀 문제로 바라봐 주세요."]}
];
// 세 요소 다 높게 나온 사람한테 보여줄 팁
var KEEP_TIPS = ["지금처럼 고마움과 애정을 자주 표현해 주세요.",
               "익숙함에 기대기보다 새로운 추억을 꾸준히 함께 만들어 가세요.",
               "서로의 변화(진로, 생활, 관심사)를 응원하며 대화를 이어 가세요."];

// 8가지 사랑 유형
// 키는 친밀, 열정, 약속 순서로 강하면 1 약하면 0
// ex) 101이면 친밀감이랑 약속만 강한 우애적 사랑
var TYPES = {
"000":{name:"비사랑", en:"Non-love", tag:"세 요소 모두 약함", bg:"#EEF0F5", tc:"#5E6A82",
  ch:{color:"#9AA5BC", eyes:"sleepy", mouth:"flat", acc:["cloud"]},
  sum:"지금은 사랑의 세 요소가 모두 뚜렷하지 않은 상태예요.",
  desc:"일상적인 인간관계에 가까운 상태예요. 관계가 막 시작되어 아직 감정이 자라는 중이거나, 마음이 잠시 멀어진 시기일 수도 있어요.",
  good:"정해진 틀 없이, 앞으로 어떤 관계로 만들어 갈지 선택할 여지가 있어요.",
  watch:"이 관계에서 내가 무엇을 원하는지, 지금 내 마음은 어떤지 먼저 차분히 돌아보세요."},
"100":{name:"좋아함", en:"Liking", tag:"친밀감", bg:"#FFF0E2", tc:"#D96515",
  ch:{color:"#FF9F43", eyes:"happy", mouth:"smile", acc:["bubble"]},
  sum:"마음은 가깝지만, 설렘과 약속은 아직 약한 사랑이에요.",
  desc:"친한 친구에게 느끼는 마음과 비슷해요. 함께 있으면 편하고 믿을 수 있지만, 두근거리는 설렘이나 관계의 미래에 대한 약속은 약한 편이에요.",
  good:"서로 믿고 편안하게 기댈 수 있는, 관계의 튼튼한 바탕이 있어요.",
  watch:"연인 관계라면 설렘을 나누는 시간과 함께할 미래에 대한 대화가 필요할 수 있어요."},
"010":{name:"도취적 사랑", en:"Infatuated love", tag:"열정", bg:"#FFE6EE", tc:"#D61F5A",
  ch:{color:"#FF5C8A", eyes:"heart", mouth:"open", acc:["hearts"]},
  sum:"강한 설렘이 중심인, 첫눈에 반한 듯한 사랑이에요.",
  desc:"상대에게 강하게 끌리고 설레지만, 아직 서로를 깊이 알거나 관계를 약속하는 마음은 약해요. 짝사랑이나 연애 초기에 자주 나타나요.",
  good:"강렬한 설렘은 관계를 시작하게 하는 큰 힘이 돼요.",
  watch:"열정은 빨리 타오르고 빨리 식기도 해요. 상대를 천천히 알아 가며 마음의 거리를 좁혀 보세요."},
"001":{name:"공허한 사랑", en:"Empty love", tag:"약속·책임감", bg:"#E7ECFF", tc:"#3049C9",
  ch:{color:"#5C7CFA", eyes:"dot", mouth:"small", acc:["lock"]},
  sum:"관계를 지키려는 결심은 있지만, 마음의 온기와 설렘이 약한 사랑이에요.",
  desc:"함께하겠다는 의지와 책임감은 단단하지만, 친밀함과 설렘은 약한 상태예요. 오래된 관계에서 감정이 식었거나, 결심이 감정보다 먼저인 관계에서 나타나기도 해요.",
  good:"관계를 쉽게 포기하지 않는 단단한 의지가 있어요.",
  watch:"의무감만 남지 않도록, 대화와 함께하는 즐거움을 되살려 보세요."},
"110":{name:"낭만적 사랑", en:"Romantic love", tag:"친밀감 + 열정", bg:"#FBE5F7", tc:"#B02FA6",
  ch:{color:"#D45CC9", eyes:"heart", mouth:"smile", acc:["flower","hearts"]},
  sum:"마음이 잘 통하고 설레는, 영화 속 연애 같은 사랑이에요.",
  desc:"서로 가깝고 설렘도 큰 상태예요. 함께하는 시간이 즐겁고 로맨틱하지만, 관계의 미래에 대한 약속이나 확신은 아직 약한 편이에요.",
  good:"마음도 가깝고 설렘도 있어서 함께하는 시간이 행복해요.",
  watch:"오래 함께하려면 관계에 대한 믿음과 약속도 함께 키워 가는 것이 좋아요."},
"101":{name:"우애적 사랑", en:"Companionate love", tag:"친밀감 + 약속", bg:"#DDF5F1", tc:"#13857D",
  ch:{color:"#22B5A9", eyes:"happy", mouth:"smile", acc:["hug"]},
  sum:"서로를 깊이 믿고 아끼며 오래 함께하려는, 단단한 사랑이에요.",
  desc:"오래된 연인이나 부부처럼, 깊은 우정에 가까운 사랑이에요. 마음이 가깝고 함께하려는 결심도 단단하지만, 설렘은 다소 잔잔해요.",
  good:"안정적이고 편안해서 오래 지속되기 쉬운 관계예요.",
  watch:"익숙함 속에서 설렘이 줄어들 수 있어요. 새로운 경험과 애정 표현으로 열정을 깨워 보세요."},
"011":{name:"얼빠진 사랑", en:"Fatuous love (허구적 사랑)", tag:"열정 + 약속", bg:"#EEE6FF", tc:"#7444E0",
  ch:{color:"#9B6BFF", eyes:"spiral", mouth:"open", acc:["dizzy","ring"]},
  sum:"뜨겁게 끌리고 굳게 약속했지만, 서로를 깊이 알아 가는 과정이 부족한 사랑이에요.",
  desc:"짧은 만남 끝에 서둘러 약속하는 사랑처럼, 열정과 결심은 강하지만 친밀감이 약한 상태예요. 서로를 충분히 이해할 시간이 부족했을 수 있어요.",
  good:"상대에 대한 끌림과 함께하려는 의지가 모두 강해요.",
  watch:"서로를 충분히 이해하지 못하면 작은 갈등에도 흔들릴 수 있어요. 깊은 대화로 마음의 거리를 좁혀 보세요."},
"111":{name:"완전한 사랑", en:"Consummate love", tag:"세 요소 모두", bg:"#FFF3CC", tc:"#B07800",
  ch:{color:"#FFB82E", eyes:"happy", mouth:"open", acc:["crown","hug","sparkle"]},
  sum:"마음이 가깝고, 설레며, 함께하려는 결심도 단단한 사랑이에요.",
  desc:"스턴버그가 말한 가장 이상적인 사랑의 모습이에요. 친밀감, 열정, 약속·책임감이 모두 강해서 균형 잡힌 큰 삼각형을 이뤄요.",
  good:"세 요소가 고루 강한, 많은 사람이 바라는 사랑의 모습이에요.",
  watch:"스턴버그는 완전한 사랑은 이루는 것보다 지켜 가는 것이 더 어렵다고 했어요. 지금의 노력을 꾸준히 이어 가세요."}
};
// 유형 카드 보여줄 순서
var TYPE_ORDER = ["000","100","010","001","110","101","011","111"];

// 누구 떠올렸는지에 따라 문구가 살짝씩 달라짐. 연인, 짝사랑, 이상형 세 가지
var MODES = {
partner:{label:"사귀는 사람", desc:"지금 연애 중인 상대", ph:"예: 민지",
  ch:{color:"#F0457A", eyes:"happy", mouth:"smile", acc:["hug"]},
  note:"", hint:"",
  who:function(n){ return '<span class="nm">'+esc(n)+'</span>'+josa(n,"을")+' 향한 나의 사랑은'; },
  tipTitle:"삼각형을 키우려면"},
crush:{label:"좋아하는 사람", desc:"짝사랑 중이거나 마음에 둔 상대", ph:"예: 민지",
  ch:{color:"#FF8A3D", eyes:"heart", mouth:"small", acc:["hearts"]},
  note:"아직 사귀는 사이가 아니라면, 관계나 약속을 묻는 문장은 '지금 내 마음'이나 '사귄다면 어떨지'를 떠올리며 답해 주세요. 사귀기 전에는 약속·책임감 점수가 낮게 나오는 것이 자연스러워요.",
  hint:"사귀지 않는 사이라면, 지금 내 마음이나 사귄다면 어떨지 떠올리며 답해 주세요.",
  who:function(n){ return '<span class="nm">'+esc(n)+'</span>'+josa(n,"을")+' 향한 지금 내 마음은'; },
  tipTitle:"마음을 키워 가려면"},
ideal:{label:"상상 속 이상형", desc:"연인이 없다면, 내가 바라는 가상의 인물", ph:"예: 이상형",
  ch:{color:"#9B6BFF", eyes:"happy", mouth:"smile", acc:["sparkle","cloud2"]},
  note:"상상 속 인물과 함께하고 있다고 생각하며 답해 주세요. 이 경우 결과는 실제 관계가 아니라, 내가 사랑에 기대하는 모습인 '이상적인 삼각형'을 보여 줘요.",
  hint:"상상 속 그 사람과 함께하고 있다고 생각하며 답해 주세요.",
  who:function(){ return '내가 바라는 사랑은'; },
  tipTitle:"이 결과 활용하기"}
};
// 이상형 골랐을 때만 나오는 팁
var IDEAL_TIPS = ["가장 높은 요소가 내가 사랑에서 가장 중요하게 여기는 부분이에요. 새로운 사람을 만날 때 이 부분을 눈여겨보세요.",
                "가장 낮은 요소는 나에게 덜 중요한 부분이거나, 아직 잘 상상되지 않는 부분일 수 있어요.",
                "실제로 누군가를 만나게 되면 그 사람으로 다시 검사해서, 이상의 삼각형과 현실의 삼각형을 비교해 보세요."];


// 요소별 색. 친밀감 파랑, 열정 빨강, 약속 노랑
var COMP_COL = ["#4298B4","#F25E62","#E4AE3A"];
// 유형 카드에 들어가는 작은 삼각형 아이콘 만드는 함수
// 강한 요소는 꼭짓점 끝까지, 약한 요소는 안쪽으로 쏙 들어가게 그림
function triIcon(bits, tc, label){
var V = [[50,8],[8,84],[92,84]], C = [50,58.7];
var P = V.map(function(v,i){ var f = bits.charAt(i) === "1" ? 1 : .32; return [C[0]+(v[0]-C[0])*f, C[1]+(v[1]-C[1])*f]; });
var str = function(a){ return a.map(function(q){ return q[0].toFixed(1)+","+q[1].toFixed(1); }).join(" "); };
var s = '<svg viewBox="0 0 100 92" '+(label?'role="img" aria-label="'+esc(label)+'"':'aria-hidden="true"')+'>';
s += '<polygon points="'+str(V)+'" fill="#fff" stroke="#CDD0DC" stroke-width="2" stroke-linejoin="round" stroke-dasharray="3 4"/>';
s += '<polygon points="'+str(P)+'" fill="'+tc+'" fill-opacity=".22" stroke="'+tc+'" stroke-width="3" stroke-linejoin="round"/>';
P.forEach(function(q,i){ s += '<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="6" fill="'+(bits.charAt(i)==="1"?COMP_COL[i]:"#C3C6D3")+'" stroke="#fff" stroke-width="2.5"/>'; });
return s + '</svg>';
}

// 시간이 지나면서 세 요소가 어떻게 변하는지 (Sternberg, 1986)
// 실제 수치가 아니라 이론에서 말하는 흐름을 단순하게 그린 곡선임. t는 0(처음 만남)~1(오래된 관계)
var TIME = [
{i:1, title:"빨리 타오르고, 빨리 잦아들어요",
  f:function(t){ return t < .12 ? .95*Math.sin(Math.PI/2*t/.12) : .4 + .55*Math.exp(-(t-.12)/.16); },
  txt:["세 요소 중 가장 먼저, 가장 가파르게 올라가요. 첫눈에 반하는 것처럼 며칠, 몇 주 만에도 최고점에 닿을 수 있어요.",
       "하지만 같은 사람에게 익숙해지면서(습관화) 최고점을 지나면 점점 낮아지고, 처음보다 낮은 수준에서 자리를 잡아요.",
       "스턴버그는 이걸 중독과 비슷한 ‘반대 과정’으로 설명했어요. 그래서 관계가 끝나면 금단 증상처럼 그리움과 허전함이 크게 올 수 있어요."],
  point:"오래된 관계에서 열정이 낮게 나온 건 ‘사랑이 식었다’기보다 자연스러운 변화예요. 새로운 경험과 표현으로 다시 깨울 수 있는 요소라고 알려 주세요."},
{i:0, title:"꾸준히, 천천히 쌓여요",
  f:function(t){ return .82*(1-Math.exp(-t/.28)); },
  f2:function(t){ var b = .82*(1-Math.exp(-t/.28)); return t < .45 ? b : b*(1-.33*(1-Math.exp(-(t-.45)/.22))); },
  txt:["서로를 알아 가는 만큼 꾸준히 올라가다가, 시간이 지나면 오르는 속도가 점점 느려지며 완만해져요.",
       "관계가 안정되면 서로를 너무 잘 알게 되어 겉으로 느껴지는 친밀감(점선)은 줄어들 수 있어요. 그래도 밑바닥의 친밀감(실선)은 그대로 자라 있어요.",
       "이 숨은 친밀감은 위기나 헤어질 뻔한 순간에 ‘이 사람이 내게 이만큼 소중했구나’ 하고 드러나요."],
  point:"“요즘 예전만큼 가깝게 느껴지지 않는다”는 말이 나오면, 친밀감이 사라졌다기보다 익숙해져서 잘 안 보이는 것일 수 있다고 이야기해 주세요."},
{i:2, title:"처음엔 느리게, 어느 순간 빠르게, 그다음엔 단단하게",
  f:function(t){ var g = function(x){ return .88/(1+Math.exp(-(x-.42)/.08)); }; return g(t) - g(0); },
  txt:["처음 만났을 때는 거의 0에서 시작해서 아주 천천히 올라가요.",
       "사귀기로 하거나 미래를 이야기하는 시기가 오면 갑자기 가파르게 올라가고, 그 뒤로는 높은 곳에서 평평하게 유지돼요(S자 곡선).",
       "관계가 흔들리면 천천히 내려가고, 관계가 끝나면 다시 0으로 돌아가요."],
  point:"사귄 지 얼마 안 됐거나 짝사랑이라면 약속·책임감이 낮은 건 당연해요. 점수가 낮다고 마음이 가볍다는 뜻이 아니라고 꼭 짚어 주세요."}
];
// 유형마다 그래프의 어느 시기와 닮았는지
var TIME_TYPE = {
"000":"세 곡선이 모두 아래에 있어요. 관계가 막 시작되어 아직 아무 곡선도 오르지 않은 시점이거나, 반대로 곡선들이 내려온 시기일 수 있어요. 관계가 얼마나 되었는지 먼저 가볍게 물어보세요.",
"100":"친밀감 곡선만 올라온 모양이에요. 오래 알고 지낸 친구 사이처럼 마음은 가까워졌지만, 열정 곡선은 오르지 않았고 약속 곡선은 아직 출발 전일 수 있어요.",
"010":"그래프 맨 왼쪽, 열정 곡선만 치솟은 시점과 닮았어요. 친밀감과 약속은 원래 늦게 오르는 요소라서, 연애 초기나 짝사랑이라면 아주 자연스러운 모양이에요.",
"001":"약속 곡선은 높이 남아 있는데 열정과 친밀감은 내려온 모양이에요. 오래된 관계라면 겉으로 느끼는 친밀감(점선)이 줄어든 시기일 수 있어요.",
"110":"열정과 친밀감이 함께 오른, 그래프 앞쪽 시기와 닮았어요. 약속 곡선은 보통 이 다음에 가파르게 오르기 시작해요.",
"101":"그래프 오른쪽, 오래된 관계의 모양과 가장 닮았어요. 열정이 습관화로 잦아든 것은 자연스러운 흐름이에요.",
"011":"빠르게 오르는 열정을 따라 약속도 빨리 올라갔지만, 천천히 쌓여야 하는 친밀감이 아직 따라오지 못한 모양이에요.",
"111":"세 곡선이 모두 높은 지점에 있어요. 시간이 지나면 열정은 자연스럽게 잦아드는 경향이 있어서, 이 모양을 지키려면 꾸준한 노력이 필요해요."
};
// svg 안 글씨용 글꼴
var SVG_FONT = "'Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic','Noto Sans CJK KR',sans-serif";
// 시간에 따른 세 요소 변화 그래프
function timeChartSVG(){
var W = 640, H = 330, L = 44, Rt = 620, T = 58, B = 268, N = 80;
var X = function(t){ return L + (Rt-L)*t; }, Y = function(v){ return B - (B-T)*v; };
var line = function(fn){ var p = []; for(var k=0;k<=N;k++){ var t = k/N; p.push(X(t).toFixed(1)+","+Y(fn(t)).toFixed(1)); } return p.join(" "); };
var s = '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="시간에 따른 친밀감, 열정, 약속·책임감의 변화. 열정은 빠르게 올랐다가 내려오고, 친밀감은 꾸준히 오르며, 약속·책임감은 천천히 시작해 가파르게 오른 뒤 평평해져요.">';
s += '<rect x="'+L+'" y="'+T+'" width="'+(Rt-L)+'" height="'+(B-T)+'" fill="#F7F8FA" rx="6"/>';
[.33,.66].forEach(function(t){ s += '<line x1="'+X(t)+'" y1="'+T+'" x2="'+X(t)+'" y2="'+B+'" stroke="#E1E4EA" stroke-width="1.5" stroke-dasharray="4 5"/>'; });
s += '<line x1="'+L+'" y1="'+B+'" x2="'+Rt+'" y2="'+B+'" stroke="#9AA1AE" stroke-width="2"/><line x1="'+L+'" y1="'+T+'" x2="'+L+'" y2="'+B+'" stroke="#9AA1AE" stroke-width="2"/>';
var ft = 'font-family:'+SVG_FONT.replace(/'/g,"")+';';
s += '<text x="'+(L-10)+'" y="'+(T+6)+'" text-anchor="end" style="'+ft+'font-size:13px;font-weight:700" fill="#646C7C">강</text>';
s += '<text x="'+(L-10)+'" y="'+B+'" text-anchor="end" style="'+ft+'font-size:13px;font-weight:700" fill="#646C7C">약</text>';
[["처음 만남",.165],["관계가 깊어지는 시기",.495],["오래된 관계",.83]].forEach(function(p){ s += '<text x="'+X(p[1])+'" y="'+(B+24)+'" text-anchor="middle" style="'+ft+'font-size:14px;font-weight:700" fill="#646C7C">'+p[0]+'</text>'; });
s += '<text x="'+Rt+'" y="'+(B+50)+'" text-anchor="end" style="'+ft+'font-size:12.5px" fill="#9AA1AE">시간 →</text>';
s += '<polyline points="'+line(TIME[1].f2)+'" fill="none" stroke="'+COMP_COL[0]+'" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round" opacity=".75"/>';
TIME.forEach(function(d){ s += '<polyline points="'+line(d.f)+'" fill="none" stroke="'+COMP_COL[d.i]+'" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>'; });
// 범례
var lg = [[0,"친밀감",0],[1,"열정",0],[2,"약속·책임감",0],[0,"겉으로 느끼는 친밀감",1]], lx = L;
lg.forEach(function(g){
  s += '<line x1="'+lx+'" y1="22" x2="'+(lx+26)+'" y2="22" stroke="'+COMP_COL[g[0]]+'" stroke-width="'+(g[2]?3:4.5)+'" stroke-linecap="round"'+(g[2]?' stroke-dasharray="6 5" opacity=".75"':'')+'/>';
  s += '<text x="'+(lx+33)+'" y="27" style="'+ft+'font-size:14px;font-weight:700" fill="#343C4B">'+g[1]+'</text>';
  lx += 46 + g[1].length*14;
});
return s + '</svg>';
}

// 여기부터 자주 쓰는 함수 모음
// $는 제이쿼리 흉내. 쓰기 편해서 만듦
// 없는 요소면 빈 껍데기를 돌려줌. report.html에는 검사 화면이 없어서, 이렇게 해야 같은 js를 써도 에러가 안 남
var NOEL = document.createElement("div");
function $(s){ return document.querySelector(s) || NOEL; }
// 지금 열린 게 해석 가이드 페이지인지
var REPORT = !!document.getElementById("reportView");
// 이름에 꺾쇠 같은 거 넣어도 화면 안 깨지게 막아주는 거. 지우면 안 됨
function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
// 한글 조사 자동으로 붙이는 용도. 받침 있으면 을, 없으면 를 이런 식
// 민지를, 지민을 둘 다 맞게 나옴. 은근 개중요함
var PAIRS = {"은":["은","는"],"는":["은","는"],"이":["이","가"],"가":["이","가"],"을":["을","를"],"를":["을","를"],"과":["과","와"],"와":["과","와"],"로":["으로","로"]};
function josa(word, p){
var pr = PAIRS[p]; if(!pr) return p;
var ch = String(word).trim().slice(-1), code = ch.charCodeAt(0);
if(code >= 0xAC00 && code <= 0xD7A3){
  var jong = (code - 0xAC00) % 28;
  if(p === "로") return (jong === 0 || jong === 8) ? "로" : "으로";
  return jong > 0 ? pr[0] : pr[1];
}
return p === "로" ? "(으)로" : pr[0] + "(" + pr[1] + ")";
}
// 이름 안 적으면 그 사람으로 나옴
function dispName(){ return (state.name || "").trim() || "그 사람"; }
// 문항 속 {N} 자리에 이름 끼워넣기
function fill(text){
var n = dispName();
return text.replace(/\{N(?::([^}]+))?\}/g, function(m, p){ return '<span class="nm">'+esc(n)+'</span>' + (p ? josa(n, p) : ""); });
}
// 소수 첫째 자리까지 반올림
function r1(x){ return Math.round(x * 10) / 10; }
// 점수 보고 높음, 보통, 낮음 정함
function level(v){ return v >= HIGH ? "high" : (v >= MID ? "mid" : "low"); }
var LV_TXT = {high:"높음", mid:"보통", low:"낮음"};
// 화면 전환. 메인, 대상선택, 문항, 완료, 결과 중에 하나만 보이게 함
function show(id){
["intro","setup","quiz","done","result"].forEach(function(s){ $("#"+s).classList.toggle("active", s === id); });
document.body.dataset.screen = id;
window.scrollTo(0, 0);
}
// 화면 아래 잠깐 떴다 사라지는 알림
var toastTimer;
function toast(msg){ var t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function(){ t.classList.remove("show"); }, 2000); }
// 기기에서 애니메이션 줄이기 켜둔 사람은 움직임 꺼줌. 접근성 챙김
var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 답변 저장. 브라우저 localStorage에 넣어서 새로고침해도 안 날아감
// 검사를 끝내면 해석 가이드 링크가 해석자 메일로만 감 (MAIL_URL 설정했을 때). 그 외엔 어디에도 안 보냄
// 저장 키 이름. 데이터 구조 바꾸면 v3로 올려야 옛날 거랑 안 꼬임
var STORE = "sternberg-love-v2";
var state = {name:"", target:"partner", answers:new Array(TOTAL).fill(null), page:0};
// 저장된 거 불러오기. 형식 이상하면 그냥 없는 걸로 침
function loadState(){
try{ var s = JSON.parse(localStorage.getItem(STORE));
  if(s && Array.isArray(s.answers) && s.answers.length === TOTAL){ if(!MODES[s.target]) s.target = "partner"; s.page = s.page || 0; return s; } }catch(e){}
return null;
}
function saveState(){ if(REPORT) return; try{ localStorage.setItem(STORE, JSON.stringify(state)); }catch(e){} }
// 지금 고른 대상 정보 가져오기
function mode(){ return MODES[state.target] || MODES.partner; }
// 접수번호. 해석자가 메일로 받은 링크랑 눈앞의 응답자를 맞춰 보는 용도
// 헷갈리는 글자(0 O 1 I L)는 뺐음
function newRid(){ var a = "23456789ABCDEFGHJKMNPQRSTUVWXYZ", r = ""; for(var i=0;i<4;i++) r += a.charAt(Math.floor(Math.random()*a.length)); return r; }
function rid(){ if(!state.rid){ state.rid = newRid(); saveState(); } return state.rid; }


// 유형 코드용 글자. I 친밀감, P 열정, C 약속
// mbti처럼 보이게 하려고 넣음 ㅋㅋ 강하면 대문자, 약하면 소문자 ex) IpC
var LETTER = ["I","P","C"], LETTER_KO = ["친밀감","열정","약속·책임감"], KEYS = ["int","pas","com"];
// 코드 글자에 색 입혀서 html로 뽑기
function codeHTML(bits){
return LETTER.map(function(L,i){ var on = bits.charAt(i) === "1"; return '<span class="'+KEYS[i]+' '+(on?"on":"off")+'">'+(on?L:L.toLowerCase())+'</span>'; }).join("");
}
// 복사할 때 쓰는 코드 텍스트 버전
function codeText(bits){ return LETTER.map(function(L,i){ return bits.charAt(i) === "1" ? L : L.toLowerCase(); }).join(""); }

// 로고 아이콘이랑 푸터 문구 넣기
$("#logoArt").innerHTML = triIcon("111", "#88619A");
$("#footText").textContent = DEPT + " " + BOOTH + " · 스턴버그(Sternberg, 1986)의 사랑의 삼각형 이론과 삼각형 사랑 척도(1997)를 바탕으로 만든 자기이해용 검사예요. 임상적 진단이 아니며, 결과는 지금 이 순간의 마음을 비춰 보는 참고 자료로 활용해 주세요.";

// 메인 화면 큰 삼각형 그림
// svg 좌표 손으로 찍은 거라 숫자 건들면 모양 틀어짐 주의
function heroArt(){
var s = '<svg viewBox="0 0 600 250" role="img" aria-label="친밀감, 열정, 약속·책임감이 꼭짓점을 이루는 사랑의 삼각형">';
s += '<g class="h-tri">';
s += '<polygon points="300,22 144,250 456,250" fill="#fff"/>';
s += '<polygon points="300,22 144,250 300,250" fill="#4298B4" opacity=".16"/>';
s += '<polygon points="300,22 456,250 300,250" fill="#E4AE3A" opacity=".2"/>';
s += '<polygon points="300,120 206,250 394,250" fill="#F25E62" opacity=".2"/>';
s += '<polygon points="300,22 144,250 456,250" fill="none" stroke="#343C4B" stroke-width="3" stroke-linejoin="round"/>';
s += '</g>';
var V = [[300,30,"친밀감","I","#4298B4",336,"start"],[160,222,"열정","P","#F25E62",124,"end"],[440,222,"약속·책임감","C","#E4AE3A",476,"start"]];
V.forEach(function(v){
  s += '<circle cx="'+v[0]+'" cy="'+v[1]+'" r="25" fill="'+v[4]+'" stroke="#fff" stroke-width="4"/>';
  s += '<text x="'+v[0]+'" y="'+(v[1]+8)+'" text-anchor="middle" style="font:900 22px var(--font)" fill="#fff">'+v[3]+'</text>';
  s += '<text x="'+v[5]+'" y="'+(v[1]+8)+'" text-anchor="'+v[6]+'" style="font:800 21px var(--font)" fill="#343C4B">'+v[2]+'</text>';
});
return s + '</svg>';
}
// 메인 그림, 요소 카드, 유형 카드, 완료 화면 그림까지 한 번에 그림
function renderIntroArt(){
$("#heroArt").innerHTML = heroArt();
$("#compArt").innerHTML = COMP.map(function(c,i){ return '<div class="comp '+c.key+'"><span class="lt">'+LETTER[i]+'</span><h3>'+c.name+'</h3><span class="kw">'+c.kw+'</span><p>'+c.about+'</p></div>'; }).join("");
$("#typeArt").innerHTML = typeCards(null);
$("#timeArt").innerHTML = '<div class="tchart">'+timeChartSVG()+'</div>'+timeCards(true);
// 메일 보내기 켜져 있으면 안내 문구도 거기에 맞게 바꿈
if(MAIL_URL){
  $("#setupHelp").textContent = "질문 속 이름 자리에 들어가요. 비워 두면 ‘그 사람’으로 나와요. 검사를 마치면 해석을 위해 결과가 부스 해석자에게 메일로 전달돼요.";
  $("#doneText").textContent = "결과 보기를 누르면 세 요소 점수와 내 사랑의 삼각형이 나오고, 결과가 해석자에게 전달돼요. 화면에 나오는 접수번호를 해석자에게 알려 주세요.";
}
$("#doneArt").innerHTML = '<svg viewBox="0 0 132 122"><polygon points="66,8 8,114 124,114" fill="#fff" stroke="#343C4B" stroke-width="4" stroke-linejoin="round"/><text x="66" y="96" text-anchor="middle" style="font:900 44px var(--font)" fill="#88619A">?</text></svg>';
}
// 8가지 유형 카드 만들기. mine에 내 유형 넣으면 나 표시 붙음
function typeCards(mine){
return TYPE_ORDER.map(function(k){
  var t = TYPES[k];
  return '<div class="tcard'+(k===mine?" me":"")+'" style="--tbg:'+t.bg+'">'+(k===mine?'<span class="me-tag">나</span>':'')+triIcon(k, t.tc, t.name+" 삼각형 모양")+'<span class="code" aria-label="코드 '+codeText(k)+'">'+codeHTML(k)+'</span><b style="color:'+t.tc+'">'+t.name+'</b><span class="tg">'+t.tag+'</span></div>';
}).join("");
}
// 아직 안 푼 첫 문항 번호 찾기
function firstEmpty(a){ var f = a.indexOf(null); return f < 0 ? TOTAL-1 : f; }
// 메인에서 이어하기 처리. 하다 말고 나간 사람 배려용
function renderIntro(){
var saved = loadState(), row = $("#resumeRow");
var n = saved ? saved.answers.filter(function(v){return v != null;}).length : 0;
if(saved && n === TOTAL){
  row.innerHTML = '이 기기에 지난 결과가 있어요. <button class="linkbtn" type="button" id="seeBtn">결과 다시 보기</button>';
  $("#seeBtn").onclick = function(){ state = saved; showResult(); };
}else if(saved && n > 0){
  row.innerHTML = '45문항 중 '+n+'개에 답했어요. <button class="linkbtn" type="button" id="resumeBtn">이어서 하기</button>';
  $("#resumeBtn").onclick = function(){ state = saved; state.page = Math.floor(firstEmpty(state.answers)/PER); saveState(); show("quiz"); renderPage(); };
}else row.innerHTML = "";
}

// 여기부터 대상 선택 화면
// 라디오 버튼 세 개 만들기
$("#targetList").innerHTML = Object.keys(MODES).map(function(k,i){
var m = MODES[k];
return '<label class="tg-opt"><input type="radio" name="target" value="'+k+'"'+(i===0?" checked":"")+'><span class="tg-b"><b>'+m.label+'</b><span>'+m.desc+'</span></span></label>';
}).join("");
function selTarget(){ var r = document.querySelector('input[name="target"]:checked'); return r ? r.value : "partner"; }
// 대상 바꾸면 안내 문구랑 예시 이름도 바뀌게
function updateSetup(){ var m = MODES[selTarget()]; $("#modeNote").textContent = m.note; $("#nameInput").placeholder = m.ph; }
// 대상 선택 화면 열기. 전에 적은 이름 있으면 채워둠
function openSetup(){
var saved = loadState();
if(saved){
  if(saved.name && !$("#nameInput").value) $("#nameInput").value = saved.name;
  var r = document.querySelector('input[name="target"][value="'+saved.target+'"]'); if(r) r.checked = true;
}
updateSetup(); show("setup");
}
document.querySelectorAll('input[name="target"]').forEach(function(r){ r.addEventListener("change", updateSetup); });
// 검사 시작 누르면 답변 싹 비우고 1페이지부터
$("#setupForm").addEventListener("submit", function(e){
e.preventDefault();
state = {name:$("#nameInput").value.trim(), target:selTarget(), answers:new Array(TOTAL).fill(null), page:0, rid:newRid()};
saveState(); show("quiz"); renderPage();
});
// 시작 버튼이 세 군데라 다 연결해줌
["heroStart","bandStart","navStart"].forEach(function(id){ $("#"+id).onclick = openSetup; });

// 여기부터 문항 화면 로직
// 동그라미 7개 각각의 뜻. 화면엔 안 보이고 스크린리더가 읽어줌
var LABELS = {1:"전혀 아니다",2:"아니다",3:"약간 아니다",4:"중간",5:"약간 그렇다",6:"그렇다",7:"매우 그렇다"};
// 페이지 위에 뜨는 파트 이름
// p페이지에 들어갈 문항 번호 범위 계산
function pageRange(p){ var s = p*PER; return [s, Math.min(TOTAL, s+PER)]; }
// 한 페이지 문항 5개 그리기
// 왼쪽 보라색이 아니다, 오른쪽 초록색이 그렇다. 가운데로 갈수록 동그라미 작아짐
function renderPage(){
if(typeof state.page !== "number") state.page = 0;
var p = state.page, rg = pageRange(p), c = ITEMS[rg[0]].c, h = '';
for(var i=rg[0]; i<rg[1]; i++){
  var cur = state.answers[i];
  h += '<div class="q'+(cur!=null?" done":"")+'" data-i="'+i+'"><p class="q-t" id="qt'+i+'">'+fill(ITEMS[i].t)+'</p><div class="q-s"><span class="lab d">아니다</span><div class="cs" role="radiogroup" aria-labelledby="qt'+i+'">';
  for(var v=1; v<=7; v++) h += '<button type="button" class="c" data-v="'+v+'" aria-pressed="'+(cur===v)+'" aria-label="'+v+'점, '+LABELS[v]+'"><span></span></button>';
  h += '</div><span class="lab a">그렇다</span></div></div>';
}
$("#qList").innerHTML = h;
$("#qHead").className = "qhead " + KEYS[c];
$("#qHint").textContent = mode().hint;
$("#qPage").textContent = (p+1)+"페이지";
updateProgress();
}
// 상단 진행바 퍼센트 업데이트
function updateProgress(){
var n = state.answers.filter(function(v){ return v != null; }).length, pct = Math.round(n / TOTAL * 100);
$("#qFill").style.width = pct + "%"; $("#qPct").textContent = pct + "%";
$("#nextBtn").textContent = state.page === PAGES-1 ? "검사 완료" : "다음";
}
// 동그라미 눌렀을 때 실행됨
// 저장하고, 답한 문항은 흐리게 하고, 다음 안 푼 문항으로 스크롤 쭉 내려줌
function answer(i, v){
state.answers[i] = v; saveState();
var blk = document.querySelector('.q[data-i="'+i+'"]');
blk.querySelectorAll(".c").forEach(function(b){ b.setAttribute("aria-pressed", String(+b.dataset.v === v)); });
blk.classList.add("done"); blk.classList.remove("miss");
updateProgress();
var rg = pageRange(state.page), next = null;
for(var k=i+1; k<rg[1]; k++) if(state.answers[k] == null){ next = k; break; }
var target = next != null ? document.querySelector('.q[data-i="'+next+'"]') : $("#nextBtn");
setTimeout(function(){
  var r = target.getBoundingClientRect();
  window.scrollTo({top: window.scrollY + r.top - window.innerHeight/2 + r.height/2, behavior: reduceMotion ? "auto" : "smooth"});
}, 150);
}
// 클릭 이벤트는 목록에 한 번만 걸어둠. 버튼마다 거는 것보다 가벼움
$("#qList").addEventListener("click", function(e){
var b = e.target.closest(".c"); if(!b) return;
answer(+b.closest(".q").dataset.i, +b.dataset.v);
});
// 다음 버튼. 안 푼 문항 있으면 빨갛게 표시하고 못 넘어가게 막음
$("#nextBtn").onclick = function(){
var rg = pageRange(state.page), miss = [];
for(var i=rg[0]; i<rg[1]; i++) if(state.answers[i] == null) miss.push(i);
if(miss.length){
  miss.forEach(function(i){ document.querySelector('.q[data-i="'+i+'"]').classList.add("miss"); });
  var r = document.querySelector('.q[data-i="'+miss[0]+'"]').getBoundingClientRect();
  window.scrollTo({top: window.scrollY + r.top - window.innerHeight/2 + r.height/2, behavior: reduceMotion ? "auto" : "smooth"});
  toast("아직 답하지 않은 문장이 "+miss.length+"개 있어요");
  return;
}
// 마지막 페이지가 아니면 다음 페이지로, 마지막이면 완료 화면으로
if(state.page < PAGES-1){ state.page++; saveState(); renderPage(); window.scrollTo(0,0); return; }
var f = state.answers.indexOf(null);
if(f >= 0){ state.page = Math.floor(f/PER); renderPage(); window.scrollTo(0,0); toast((f+1)+"번 문장에 아직 답하지 않았어요"); return; }
show("done"); $("#interpBtn").focus({preventScroll:true});
};
// 이전 버튼. 1페이지에서 누르면 대상 선택으로 돌아감
$("#prevBtn").onclick = function(){
if(state.page > 0){ state.page--; saveState(); renderPage(); window.scrollTo(0,0); }
else openSetup();
};
// 컴퓨터로 할 때 숫자키 1부터 7로도 답할 수 있음. 숨겨진 꿀기능
document.addEventListener("keydown", function(e){
if(!$("#quiz").classList.contains("active") || (e.target && e.target.tagName === "INPUT")) return;
if(e.key >= "1" && e.key <= "7"){
  var rg = pageRange(state.page);
  for(var i=rg[0]; i<rg[1]; i++) if(state.answers[i] == null){ answer(i, +e.key); return; }
}
});

// 완료 화면 버튼들. 해석 받기 눌러야 드디어 결과 공개
// 결과 보기 누르는 순간 해석 가이드 링크를 해석자 메일로 보냄
$("#interpBtn").onclick = function(){ showResult(); sendReport(); };
$("#doneReview").onclick = function(){ state.page = 0; saveState(); show("quiz"); renderPage(); };

// 여기부터 결과 삼각형 그래프
// 세 꼭짓점 방향으로 점수만큼 뻗게 그림. 7점이면 끝까지 닿음
var S3 = Math.sqrt(3)/2, DIRS = [[0,-1],[-S3,.5],[S3,.5]], CX = 220, CY = 230, RR = 160;
function triPts(vals){ return vals.map(function(v,i){ return [CX + DIRS[i][0]*RR*v/7, CY + DIRS[i][1]*RR*v/7]; }); }
function ptsStr(p){ return p.map(function(q){ return q[0].toFixed(1)+","+q[1].toFixed(1); }).join(" "); }
// 그래프 svg 만들기. 점선은 5점 기준선
// still을 넣으면 애니메이션 없이 완성된 모양으로 그림 (해석 가이드용)
function chartSVG(sc, still){
var V = triPts([7,7,7]), Z = triPts([0,0,0]);
var s = '<svg viewBox="0 0 440 400" role="img" aria-label="친밀감 '+sc[0].toFixed(1)+'점, 열정 '+sc[1].toFixed(1)+'점, 약속·책임감 '+sc[2].toFixed(1)+'점으로 그린 사랑의 삼각형">';
s += '<polygon points="'+ptsStr(V)+'" fill="#F5F6F8" stroke="#C3C7D0" stroke-width="2" stroke-linejoin="round"/>';
s += '<polygon points="'+ptsStr(triPts([5,5,5]))+'" fill="none" stroke="#D5D8DE" stroke-width="1.5" stroke-dasharray="4 6"/>';
V.forEach(function(v){ s += '<line x1="'+CX+'" y1="'+CY+'" x2="'+v[0].toFixed(1)+'" y2="'+v[1].toFixed(1)+'" stroke="#D5D8DE" stroke-width="1.5"/>'; });
var P = still ? triPts(sc) : null;
s += '<polygon class="js-poly" points="'+ptsStr(P || Z)+'" fill="#88619A" fill-opacity=".18" stroke="#88619A" stroke-width="3" stroke-linejoin="round"/>';
for(var i=0;i<3;i++) s += '<circle class="js-dot" r="9" cx="'+(P ? P[i][0].toFixed(1) : CX)+'" cy="'+(P ? P[i][1].toFixed(1) : CY)+'" fill="'+COMP_COL[i]+'" stroke="#fff" stroke-width="3"/>';
var lab = [[CX,26,"middle"],[V[1][0],378,"middle"],[V[2][0],378,"middle"]];
COMP.forEach(function(c,i){
  s += '<text x="'+lab[i][0].toFixed(1)+'" y="'+lab[i][1]+'" text-anchor="middle" style="font-weight:800;font-size:16px;font-family:'+(still ? SVG_FONT.replace(/'/g,"") : 'var(--font)')+'" fill="'+["#2E7690","#D13E43","#A87810"][i]+'">'+c.name+' '+sc[i].toFixed(1)+'</text>';
});
return s + '</svg>';
}
// 삼각형이 가운데서 쭉 커지는 애니메이션
function animateTri(root, vals){
var poly = root.querySelector(".js-poly"), dots = root.querySelectorAll(".js-dot"), t0 = null;
function draw(e){
  var P = triPts(vals.map(function(v){ return v*e; }));
  poly.setAttribute("points", ptsStr(P));
  for(var i=0;i<3;i++){ dots[i].setAttribute("cx", P[i][0].toFixed(1)); dots[i].setAttribute("cy", P[i][1].toFixed(1)); }
}
if(reduceMotion){ draw(1); return; }
function step(now){ if(t0 === null) t0 = now; var t = Math.min(1,(now-t0)/1300); draw(1-Math.pow(1-t,3)); if(t<1) requestAnimationFrame(step); }
requestAnimationFrame(step);
}

// 여기부터 채점 로직
// 요소별로 15문항 점수 더해서 평균 냄
// 평균이 HIGH 넘는 요소는 1, 아니면 0 해서 유형 코드 만듦
function compute(){
var sums = [0,0,0];
ITEMS.forEach(function(it,i){ sums[it.c] += state.answers[i]; });
var avg = sums.map(function(s){ return r1(s/15); });
var a = avg[0], b = avg[1], c = avg[2];
// ratio는 삼각형 넓이 비율. 세 점수 다 7점이면 1 나옴
return {avg:avg, bits:avg.map(function(x){ return x >= HIGH ? "1" : "0"; }).join(""), ratio:(a*b+b*c+c*a)/147};
}
// 삼각형 크기 보고 사랑의 강도 설명
function sizeInfo(r){
var pct = Math.round(r*100);
if(r >= .65) return {pct:pct, label:"큰 삼각형", txt:"세 요소가 모두 넉넉해서 사랑의 크기가 커요. 이 사람에게 쏟는 마음이 크다는 뜻이에요."};
if(r >= .35) return {pct:pct, label:"중간 삼각형", txt:"적당한 크기의 사랑이에요. 약한 요소를 키우면 삼각형이 더 커질 수 있어요."};
return {pct:pct, label:"작은 삼각형", txt:"아직 사랑의 크기가 작은 편이에요. 시작 단계이거나, 마음이 잠시 멀어진 시기일 수 있어요."};
}
// 어느 쪽으로 쏠렸는지 문장으로 설명. 차이 0.8 안 되면 균형 잡힌 걸로 봄
function shapeInfo(avg){
var mx = 0, mn = 0;
for(var i=1;i<3;i++){ if(avg[i] > avg[mx]) mx = i; if(avg[i] < avg[mn]) mn = i; }
var gap = r1(avg[mx]-avg[mn]);
if(gap < .8) return "세 요소가 고르게 균형 잡힌, 정삼각형에 가까운 모양이에요.";
var h = COMP[mx].name, l = COMP[mn].name;
return "<b>"+h+"</b>"+josa(h,"이")+" 가장 강하고 <b>"+l+"</b>"+josa(l,"이")+" 가장 약해서, "+h+" 쪽으로 늘어난 모양이에요. 두 요소의 차이는 "+gap.toFixed(1)+"점이에요.";
}


// 결과 화면 통째로 그리는 함수
// 응답자에게는 점수랑 삼각형만 보여줌. 유형 해석은 해석자가 메일로 받은 해석 가이드 보고 직접 해 줌
function showResult(){
var R = compute(), M = mode();
var nm = dispName();
var idx = state.answers.map(function(v,i){ return i; });
// 제일 그렇다고 답한 문장 세 개, 제일 아니라고 한 문장 세 개 뽑기
var hiI = idx.slice().sort(function(a,b){ return state.answers[b]-state.answers[a] || a-b; }).slice(0,3);
var loI = idx.slice().sort(function(a,b){ return state.answers[a]-state.answers[b] || a-b; }).slice(0,3);
// 전부 같은 번호만 찍은 사람은 답변 돌아보기 안 보여줌. 의미 없어서
var flat = Math.max.apply(null, state.answers) === Math.min.apply(null, state.answers);
function itemLi(i){ var c = COMP[ITEMS[i].c]; return '<li class="'+c.key+'"><span class="sc">'+state.answers[i]+'</span><span>'+fill(ITEMS[i].t)+'<span class="cat">'+(i+1)+'번 문장, '+c.name+'</span></span></li>'; }

var h = '';
// 맨 위 헤더. 유형은 안 보여주고 접수번호만 크게
h += '<div class="rhero" style="--tbg:#F4EEF7;--tc:var(--ink)"><div class="wrap">';
h += '<p class="who">'+M.who(nm)+'</p>';
h += '<svg viewBox="0 0 132 122" aria-hidden="true"><polygon points="66,8 8,114 124,114" fill="#fff" stroke="#343C4B" stroke-width="4" stroke-linejoin="round"/><text x="66" y="96" text-anchor="middle" style="font:900 44px var(--font)" fill="#88619A">?</text></svg>';
h += '<p class="ty" style="font-size:clamp(32px,9vw,52px)">결과가 나왔어요</p>';
h += '<p class="sm">해석자에게 <b>접수번호</b>를 알려 주세요. 어떤 사랑 유형인지는 해석자와 이야기하며 함께 알아봐요.</p>';
h += '<p class="rid">접수번호 <b>'+esc(rid())+'</b></p>';
h += '</div></div>';

h += '<nav class="rnav" aria-label="결과 목차"><div class="wrap">'+
     [["rTraits","세 요소 점수"],["rTri","나의 삼각형"],["rAns","내 답변"],["rTypes","사랑 유형"]].map(function(x){ return '<button type="button" data-go="'+x[0]+'">'+esc(x[1])+'</button>'; }).join("")+'</div></nav>';

h += '<div class="wrap narrow">';
// 세 요소 점수 막대
h += '<section class="rsec" id="rTraits"><h2>세 요소 점수</h2><p class="sub">요소마다 15문장의 평균이에요. 1점부터 7점까지예요.</p><div class="traits">';
COMP.forEach(function(c,i){
  var w = ((R.avg[i]-1)/6*100).toFixed(1);
  h += '<div class="trait '+c.key+'"><div class="tt"><b>'+LETTER[i]+' '+c.name+'</b><span>'+R.avg[i].toFixed(1)+'점</span></div>'+
       '<div class="tbar"><i data-w="'+w+'"></i><span class="dot" data-l="'+w+'"></span></div><div class="tlab"><span>약함</span><span>강함</span></div><p>'+c.about+'</p></div>';
});
h += '</div></section>';

// 삼각형 그래프
h += '<section class="rsec" id="rTri"><h2>나의 사랑의 삼각형</h2><div class="tri-wrap"><div id="resFig">'+chartSVG(R.avg)+'</div><div>';
h += '<div class="readout"><h3>삼각형 읽는 법</h3><p>꼭짓점 쪽으로 멀리 뻗을수록 그 요소가 강하다는 뜻이에요. 점선은 5점 기준선이에요. 크기와 모양이 무엇을 뜻하는지는 해석자와 함께 봐요.</p></div>';
h += '</div></div></section>';

// 내 답변 돌아보기
if(!flat){
  h += '<section class="rsec" id="rAns"><h2>내 답변 돌아보기</h2><div class="cols"><div><h3>가장 그렇다고 답한 문장</h3><ul class="items">'+hiI.map(itemLi).join("")+'</ul></div>';
  h += '<div><h3>가장 아니라고 답한 문장</h3><ul class="items">'+loI.map(itemLi).join("")+'</ul></div></div></section>';
}
h += '</div>';

h += '<div class="wrap"><section class="rsec" id="rTypes"><h2>8가지 사랑 유형</h2>'+
     '<p class="sub">내 삼각형이 어느 유형에 가까운지는 해석자와 함께 찾아봐요.</p><div class="types">'+typeCards(null)+'</div></section></div>';

h += '<div class="wrap narrow"><div class="refs" style="margin-top:56px"><p>Sternberg, R. J. (1986). A triangular theory of love. <i>Psychological Review, 93</i>(2), 119–135.</p><p>Sternberg, R. J. (1997). Construct validation of a triangular love scale. <i>European Journal of Social Psychology, 27</i>(3), 313–335.</p></div>';
// 맨 아래 버튼들
h += '<div class="ractions"><button class="btn green" id="copyBtn" type="button">결과 복사하기</button><button class="btn line" id="printBtn" type="button">PDF로 저장</button></div>';
h += '<p class="redit">답을 바꾸고 싶다면 <button class="linkbtn" type="button" id="reviewBtn">답변 수정하기</button></p></div>';

$("#result").innerHTML = h;
show("result");
animateTri($("#resFig"), R.avg);
// 막대랑 그래프 애니메이션 시작
// 화면에 그려진 다음에 너비를 바꿔야 쭉 차오르는 효과가 나서 프레임 두 번 기다림
requestAnimationFrame(function(){ requestAnimationFrame(function(){
  document.querySelectorAll("#result [data-w]").forEach(function(el){ el.style.width = el.dataset.w + "%"; });
  document.querySelectorAll("#result [data-l]").forEach(function(el){ el.style.left = el.dataset.l + "%"; });
}); });
document.querySelectorAll("#result .rnav [data-go]").forEach(function(b){
  b.onclick = function(){ var t = document.getElementById(b.dataset.go); if(t) window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - 124, behavior: reduceMotion ? "auto" : "smooth"}); };
});

// 결과 복사. 카톡이나 인스타에 바로 붙여넣기 좋게 (유형은 안 넣음)
$("#copyBtn").onclick = function(){
  var out = ["[사랑의 삼각형 검사] "+DEPT+" "+BOOTH, "친밀감 "+R.avg[0].toFixed(1)+", 열정 "+R.avg[1].toFixed(1)+", 약속·책임감 "+R.avg[2].toFixed(1)+" (7점 만점)"];
  if(location.protocol.indexOf("http")===0) out.push("\n나도 해 보기: "+location.href.split("#")[0]);
  copyText(out.join("\n"));
};
$("#printBtn").onclick = function(){ window.print(); };
$("#reviewBtn").onclick = function(){ state.page = 0; show("quiz"); renderPage(); };
}
// 클립보드 복사. 안 되는 폰도 있어서 옛날 방식으로 한 번 더 시도함
function copyText(txt){
function fallback(){
  var ta = document.createElement("textarea"); ta.value = txt; ta.setAttribute("readonly",""); ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); toast("결과를 복사했어요"); }catch(e){ toast("복사하지 못했어요. 직접 선택해 복사해 주세요"); }
  document.body.removeChild(ta);
}
if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function(){ toast("결과를 복사했어요"); }, fallback);
else fallback();
}



// 여기부터 해석 가이드 (report.html)
// 해석자가 이론을 잘 몰라도 이 페이지만 보고 해석해 줄 수 있게, 점수 + 해석 순서 + 설명을 다 넣음
function pad(n){ return (n < 10 ? "0" : "") + n; }
// 시간 변화 설명 카드 세 개
// short면 해석 포인트는 빼고 그림 (메인 화면용)
function timeCards(short){
return '<div class="tc3">'+TIME.map(function(d){
  var c = COMP[d.i];
  return '<div class="tc3-i '+c.key+'"><h3><span>'+LETTER[d.i]+' '+c.name+'</span>'+d.title+'</h3><ul>'+d.txt.map(function(t){ return '<li>'+t+'</li>'; }).join("")+'</ul>'+(short ? '' : '<p class="pt"><b>해석 포인트</b>'+d.point+'</p>')+'</div>';
}).join("")+'</div>';
}
// 이 사람 결과가 시간 그래프의 어디쯤인지
function timeNote(bits){
if(state.target === "ideal") return "이상형을 떠올리고 답한 결과라서 실제 관계의 시기와는 상관이 없어요. 대신 실제 관계에서는 열정이 가장 먼저 변하고, 친밀감과 약속은 시간이 지나야 자란다는 점을 함께 이야기해 보세요. 지금 기대하는 모양이 관계의 어느 시기와 닮았는지 물어봐도 좋아요.";
var t = TIME_TYPE[bits];
if(state.target === "crush") t += " 아직 사귀지 않는 사이라면 약속·책임감 곡선이 출발 전인 게 자연스러워요.";
return t;
}
// 해석 시작할 때 읽어 줄 한두 문장
function opener(R, T){
var mx = 0, mn = 0;
for(var i=1;i<3;i++){ if(R.avg[i] > R.avg[mx]) mx = i; if(R.avg[i] < R.avg[mn]) mn = i; }
var a = r1(R.avg[mx]-R.avg[mn]) < .8
  ? "세 꼭짓점이 비슷하게 뻗은, 고른 모양의 삼각형이에요."
  : COMP[mx].name+josa(COMP[mx].name,"이")+" 가장 길게 뻗고 "+COMP[mn].name+josa(COMP[mn].name,"이")+" 가장 짧은 삼각형이에요.";
return a+" 점수로 보면 ‘"+T.name+"’에 가까운 모양이에요. 어떤 사랑인지 같이 살펴볼까요?";
}
function buildReport(){
var R = compute(), T = TYPES[R.bits], size = sizeInfo(R.ratio), M = mode(), lv = R.avg.map(level), code = codeText(R.bits);
var d = state.at ? new Date(state.at) : new Date(), dt = d.getFullYear()+"."+pad(d.getMonth()+1)+"."+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes());
var who = M.label + (state.target !== "ideal" && (state.name||"").trim() ? " · "+esc(state.name.trim()) : "");
var idx = state.answers.map(function(v,i){ return i; });
var hiI = idx.slice().sort(function(a,b){ return state.answers[b]-state.answers[a] || a-b; }).slice(0,3);
var loI = idx.slice().sort(function(a,b){ return state.answers[a]-state.answers[b] || a-b; }).slice(0,3);
var flat = Math.max.apply(null, state.answers) === Math.min.apply(null, state.answers);
var weak = [0,1,2].filter(function(i){ return lv[i] !== "high"; }).sort(function(a,b){ return R.avg[a]-R.avg[b]; });
var li = function(t){ return '<li>'+t+'</li>'; };
var head = function(n, t){ return '<div class="rp-h"><span>'+n+'</span><h2>'+t+'</h2></div>'; };
var h = '<div class="rp">';

// 한눈에 보기
h += '<div class="rp-top"><div><p class="rp-k">사랑의 삼각형 검사 · 해석자용 가이드</p><h1>접수번호 '+esc(rid())+'</h1></div>';
h += '<div class="rp-meta"><span>'+dt+'</span><span>떠올린 사람: '+who+'</span><span>'+esc(DEPT+" "+BOOTH)+'</span></div></div>';
h += '<div class="rp-blk rp-type" style="--tbg:'+T.bg+';--tc:'+T.tc+'">'+triIcon(R.bits, T.tc)+'<div><p class="rp-k">점수로 계산한 유형</p><p class="nm">'+T.name+' <span class="code">'+codeHTML(R.bits)+'</span></p><p class="en">'+T.en+' · '+T.tag+'</p><p>'+T.sum+'</p></div></div>';
h += '<div class="rp-blk rp-say"><b>이렇게 시작해 보세요</b><p>“'+opener(R, T)+'”</p></div>';
h += '<div class="rp-blk rp-two"><div class="rp-tri">'+chartSVG(R.avg, true)+'</div><div>';
COMP.forEach(function(c,i){
  h += '<div class="rp-bar '+c.key+'"><p><b>'+LETTER[i]+' '+c.name+'</b><span>'+R.avg[i].toFixed(1)+'점 <em class="'+lv[i]+'">'+LV_TXT[lv[i]]+'</em></span></p><div class="tb"><i style="width:'+((R.avg[i]-1)/6*100).toFixed(1)+'%"></i></div></div>';
});
h += '<p class="rp-mini"><b>크기 '+size.pct+'% · '+size.label+'</b><br>'+size.txt+'</p><p class="rp-mini"><b>모양</b><br>'+shapeInfo(R.avg)+'</p>';
h += '</div></div>';
h += '<div class="rp-blk"><h3 class="rp-s">'+T.name+josa(T.name,"은")+' 어떤 사랑일까요?</h3><p>'+T.desc+'</p>';
if(state.target === "ideal") h += '<p class="rp-warn">이상형을 떠올리고 답했어요. 실제 관계가 아니라 이 사람이 사랑에 기대하는 모습이에요.</p>';
else if(state.target === "crush") h += '<p class="rp-warn">좋아하는 사람(사귀기 전)을 떠올리고 답했어요. 약속·책임감이 낮게 나오는 게 자연스러워요.</p>';
h += '<div class="rp-gw"><div class="good"><b>강점</b><p>'+T.good+'</p></div><div class="watch"><b>살펴보면 좋은 점</b><p>'+T.watch+'</p></div></div></div>';

// 해석 순서
h += '<div class="rp-new">'+head(1,"이 순서대로 해석해 주세요")+'<p class="rp-lead">한 사람에 5분 정도면 충분해요. 굵은 글씨는 그대로 말해도 되는 문장이에요.</p></div>';
var steps = [
 ["누구를 떠올렸는지 확인하기", "이 응답자는 <b>"+M.label+"</b>"+josa(M.label,"을")+" 떠올리고 답했어요."+(state.target === "ideal" ? " 이상형 결과는 실제 관계가 아니라 기대하는 사랑의 모습으로 해석해요." : ""), "“어떤 분을 떠올리며 하셨어요? 말하고 싶은 만큼만 알려 주세요.”"],
 ["세 요소 소개하기", "친밀감은 <b>마음의 가까움</b>, 열정은 <b>설렘과 끌림</b>, 약속·책임감은 <b>이 관계를 지키려는 결심</b>이에요. 세 요소가 삼각형의 세 꼭짓점이에요.", "“스턴버그라는 심리학자는 사랑을 세 가지 재료로 된 삼각형이라고 봤어요.”"],
 ["삼각형의 크기 보기", "크기는 사랑의 <b>강도</b>예요. 이 응답자는 <b>"+size.pct+"% ("+size.label+")</b>예요. "+size.txt, "“삼각형이 클수록 이 사람에게 쏟는 마음이 크다는 뜻이에요.”"],
 ["삼각형의 모양 보기", shapeInfo(R.avg)+" 모양은 사랑의 <b>종류</b>예요. 5점 이상인 요소를 대문자로 써서 코드 <b>"+code+"</b>, 유형은 <b>"+T.name+"</b>이에요.", "“"+opener(R, T)+"”"],
 ["시간 이야기 나누기", "아래 ‘시간에 따라 세 요소는 이렇게 변해요’ 그래프를 보여 주세요. 세 요소는 오르는 속도가 달라요. "+timeNote(R.bits), "“지금 관계는 얼마나 되셨어요? 그래프에서 어디쯤인 것 같아요?”"],
 ["답변 돌아보기", flat ? "모든 문장에 같은 점수를 줬어요. 문장을 돌아보기보다 검사하면서 어떤 생각이 들었는지 물어보세요." : "아래 ‘응답 전체’에서 ★는 가장 그렇다, ▽는 가장 아니다로 답한 문장이에요. 그 문장을 짚으며 이야기를 들어 보세요.", flat ? "“답하면서 어떤 생각이 들었어요?”" : "“이 문장에 "+state.answers[hiI[0]]+"점을 주셨는데, 어떤 순간이 떠올랐어요?”"],
 ["키워 갈 점 하나 정하고 마무리", "아래 ‘세 요소 하나씩 보기’의 키우는 방법 중 이 응답자에게 맞는 것 하나를 함께 골라요. 응답자가 직접 말하게 하면 더 오래 기억해요.", "“오늘 이야기 중에 하나만 실천해 본다면 뭐가 좋을까요?”"]
];
steps.forEach(function(s, i){ h += '<div class="rp-blk rp-step"><span class="n">'+(i+1)+'</span><div><h3>'+s[0]+'</h3><p>'+s[1]+'</p><p class="say">'+s[2]+'</p></div></div>'; });


// 요소별
h += '<div class="rp-new">'+head(2,"세 요소 하나씩 보기")+'<p class="rp-lead">각 요소는 15문장의 평균이에요. 1점(전혀 아니다)부터 7점(매우 그렇다)까지예요.</p></div>';
COMP.forEach(function(c,i){
  h += '<div class="rp-blk rp-comp '+c.key+'"><div class="ch"><b>'+LETTER[i]+'</b><h3>'+c.name+'</h3><span class="kw">'+c.kw+'</span><span class="sc">'+R.avg[i].toFixed(1)+'점 <em class="'+lv[i]+'">'+LV_TXT[lv[i]]+'</em></span></div>';
  h += '<p><b>뜻</b> '+c.about+'</p><p><b>이 점수는</b> '+c.lv[lv[i]]+'</p><p class="say">“'+c.ask+'”</p>';
  h += '<p class="tt">'+c.name+josa(c.name,"을")+' 키우는 방법'+(weak.indexOf(i) >= 0 && weak.indexOf(i) < 2 && state.target !== "ideal" ? ' <em>이 응답자에게 추천</em>' : '')+'</p><ul>'+c.tips.map(li).join("")+'</ul></div>';
});
if(state.target === "ideal") h += '<div class="rp-blk rp-say"><b>이상형 결과 활용하기</b><ul>'+IDEAL_TIPS.map(li).join("")+'</ul></div>';
else if(!weak.length) h += '<div class="rp-blk rp-say"><b>세 요소가 모두 높아요. 지금의 사랑을 지켜 가려면</b><ul>'+KEEP_TIPS.map(li).join("")+'</ul></div>';

// 시간
h += '<div class="rp-new">'+head(3,"시간에 따라 세 요소는 이렇게 변해요")+'<p class="rp-lead">세 요소는 오르는 속도가 서로 달라요. 실제 수치가 아니라 스턴버그(1986)가 설명한 일반적인 흐름을 단순하게 그린 그림이에요. 관계마다 다를 수 있어요.</p></div>';
h += '<div class="rp-blk rp-chart">'+timeChartSVG()+'</div>';
h += '<div class="rp-blk">'+timeCards()+'</div>';
h += '<div class="rp-blk rp-say"><b>이 응답자는 그래프의 어디쯤일까</b><p>'+timeNote(R.bits)+'</p></div>';

// 응답 전체
h += '<div class="rp-new">'+head(4,"응답 전체")+'<p class="rp-lead">★는 가장 그렇다고 답한 문장, ▽는 가장 아니라고 답한 문장이에요. 이야기를 꺼낼 때 활용해 주세요.</p></div>';
h += '<div class="rp-ans">';
COMP.forEach(function(c,ci){
  h += '<div class="rp-blk '+c.key+'"><h3 class="rp-s">'+LETTER[ci]+' '+c.name+' <small>평균 '+R.avg[ci].toFixed(1)+'</small></h3><ol>';
  ITEMS.forEach(function(it,i){
    if(it.c !== ci) return;
    var mk = flat ? "" : (hiI.indexOf(i) >= 0 ? "★" : (loI.indexOf(i) >= 0 ? "▽" : ""));
    h += '<li'+(mk ? ' class="mk"' : '')+'><span class="v">'+state.answers[i]+'</span><span class="t">'+(i+1)+'. '+fill(it.t)+'</span><span class="m">'+mk+'</span></li>';
  });
  h += '</ol></div>';
});
h += '</div>';
h += '<div class="rp-blk"><h3 class="rp-s">8가지 사랑 유형 한눈에 보기</h3><div class="rp-types">';
TYPE_ORDER.forEach(function(k){ var t = TYPES[k]; h += '<div'+(k === R.bits ? ' class="me"' : '')+'>'+triIcon(k, t.tc)+'<p><b style="color:'+t.tc+'">'+t.name+'</b> <span class="code">'+codeHTML(k)+'</span>'+(k === R.bits ? ' <em>이 응답자</em>' : '')+'<br>'+t.sum+'</p></div>'; });
h += '</div></div>';
h += '<div class="rp-blk rp-refs"><p>Sternberg, R. J. (1986). A triangular theory of love. <i>Psychological Review, 93</i>(2), 119–135.</p><p>Sternberg, R. J. (1997). Construct validation of a triangular love scale. <i>European Journal of Social Psychology, 27</i>(3), 313–335.</p></div>';
return h + '</div>';
}

// 해석 가이드 링크. 결과는 주소 # 뒤에 다 들어 있음 (# 뒤는 서버로 안 가서 깃허브에도 안 남음)
// a: 45문항 답, t: 떠올린 사람 종류, n: 이름, r: 접수번호, d: 검사한 시각
function reportLink(){
var q = "r="+rid()+"&t="+state.target+"&a="+state.answers.join("")+"&d="+Date.now()+((state.name||"").trim() ? "&n="+encodeURIComponent(state.name.trim()) : "");
return new URL("report.html", location.href).href.split("#")[0] + "#" + q;
}
// 해석 가이드 페이지 그리기 (report.html)
function renderReportPage(){
var box = document.getElementById("reportView"), p = {};
location.hash.replace(/^#/, "").split("&").forEach(function(kv){ var i = kv.indexOf("="); if(i > 0) p[kv.slice(0,i)] = decodeURIComponent(kv.slice(i+1)); });
if(!/^[1-7]{45}$/.test(p.a || "") || !MODES[p.t] || !/^[0-9A-Z]{4}$/.test(p.r || "")){
  box.innerHTML = '<div class="rp-bad"><h1>링크가 올바르지 않아요</h1><p>메일에 있는 링크를 처음부터 끝까지 다 복사했는지 확인해 주세요.</p></div>';
  return;
}
state = {name:(p.n || "").slice(0,12), target:p.t, answers:p.a.split("").map(Number), page:0, rid:p.r, at:+p.d || 0};
document.title = "해석 가이드 " + p.r + " | 사랑의 삼각형";
box.innerHTML = buildReport();
}
window.addEventListener("hashchange", function(){ if(REPORT) renderReportPage(); });

// 해석자에게 메일 보내기. 화면에는 아무것도 안 띄우고 뒤에서 조용히 보냄
// 같은 답변으로는 한 번만 보냄. 실패하면 몇 초 뒤에 알아서 다시 시도함 (최대 3번)
var sendBusy = false;
function reportSig(){ return state.answers.join("")+"|"+state.target+"|"+(state.name||""); }
function sendReport(tries){
tries = tries || 0;
if(!MAIL_URL || sendBusy || state.sent === reportSig()) return;
sendBusy = true;
var R = compute(), T = TYPES[R.bits], code = codeText(R.bits), sig = reportSig();
var sc = "친밀감 "+R.avg[0].toFixed(1)+" · 열정 "+R.avg[1].toFixed(1)+" · 약속·책임감 "+R.avg[2].toFixed(1);
var link = reportLink();
Promise.resolve().then(function(){
  var lines = ["접수번호: "+rid(), "떠올린 사람: "+mode().label, "세 요소: "+sc+" (7점 만점)", "점수로 계산한 유형: "+T.name+" ("+code+")", "", "해석 가이드 열기: "+link, "", "링크를 열면 해석 순서와 설명이 모두 나와요. 응답자에게 접수번호를 확인한 뒤 해석해 주세요."];
  var body = {
    rid: rid(),
    subject: "[사랑의 삼각형] 접수 "+rid()+" · "+T.name+" ("+code+")",
    text: lines.join("\n"),
    html: '<div style="font-family:sans-serif;font-size:15px;line-height:1.7"><p style="font-size:22px;font-weight:800;margin:0 0 8px">접수번호 '+esc(rid())+'</p><p style="margin:0">떠올린 사람: '+esc(mode().label)+'<br>세 요소: '+esc(sc)+' <span style="color:#999">(7점 만점)</span><br>점수로 계산한 유형: <b>'+esc(T.name)+' ('+code+')</b></p><p style="margin:20px 0"><a href="'+esc(link)+'" style="display:inline-block;background:#88619A;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:999px">해석 가이드 열기</a></p><p style="color:#666;font-size:13px">링크를 열면 해석 순서와 설명이 모두 나와요. 이 메일이 그대로 기록으로 남아요. 응답자에게 접수번호를 확인한 뒤 해석해 주세요.</p></div>',
    link: link
  };
  // text/plain으로 보내야 브라우저가 사전 확인(CORS preflight)을 안 해서 Apps Script로 바로 감
  return fetch(MAIL_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(body)});
}).then(function(r){ return r.json(); }).then(function(j){
  if(!j || !j.ok) throw new Error(j && j.error || "전송 실패");
  state.sent = sig; saveState(); sendBusy = false;
}).catch(function(e){
  console.error(e); sendBusy = false;
  if(tries < 2) setTimeout(function(){ sendReport(tries+1); }, 5000);
});
}

// 로고 누르면 메인으로
$("#homeBtn").onclick = function(){ show("intro"); renderIntro(); };
// 상단 메뉴 누르면 해당 섹션으로 스크롤
document.querySelectorAll(".nav [data-go]").forEach(function(b){
b.onclick = function(){
  if(!$("#intro").classList.contains("active")){ show("intro"); renderIntro(); }
  var el = document.getElementById(b.dataset.go);
  setTimeout(function(){ window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: reduceMotion ? "auto" : "smooth"}); }, 30);
};
});
// 처음 열면 메인 그려주고 시작. 해석 가이드 페이지면 가이드를 그림
if(REPORT) renderReportPage();
else { renderIntroArt(); renderIntro(); }
})();