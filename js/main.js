////----------変数宣言部----------////
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var obj1 = document.getElementById("selfketsu");
var obj2 = document.getElementById("faction");
var obj3 = document.getElementById("episode");

//---初期化---//
var image = new Image();
var addimageL = new Image();
var addimageR = new Image();
var compic = new Image();

var dataurl = null;

var episodenum = 1;
var x = 0;

var width;
var height;

var castration;
var resultwidth;
var cropwidth;
var resizewidth;



//----------イベントリスナ----------////

//画像ファイルに変更があれば呼ばれるイベントリスナ
obj1.addEventListener("change", function(evt){
	var file = evt.target.files;
	var reader = new FileReader();

	reader.readAsDataURL(file[0]);

	reader.onload = function(){
		dataurl = reader.result;

		document.getElementById("ketsusource").innerHTML = "<img src='" + dataurl + "'>";
	}
},false);

//ラジオボタンに変更があれば呼ばれるイベントリスナ
obj2.addEventListener("change", function(){
	episodetoggle();
	if( $('input[value=add]:eq(0)').is(':checked') ){
		$(".ketsucrop").replaceWith('<input type="button" value="Recover!" class="twitter ketsuadd" onclick="ketsuadd(dataurl)">');
	} else {
		$(".ketsuadd").replaceWith('<input type="button" value="Crop!" class="twitter ketsucrop" onclick="ketsucrop(dataurl)">');
	}
});

//選択リストに変更があれば呼ばれるイベントリスナ
obj3.addEventListener("change", function(){
	//リストの値を取得
	episodenum = $('#episode').val();
});



//----------関数----------////

//クロップ前の変数初期化処理
function initcropper(){
	image.src = dataurl;

	width = image.width;
	height = image.height;

	castration = width;

}

//canvasの内容をpng画像に変換しimgタグ内に描画する関数
function convertcanvas2png(){
	
	var png = canvas.toDataURL();
	document.getElementById("pngImage").src = png;

	//canvas内容を削除して要素を擬似的に隠す
	ctx.clearRect(0, 0, width, height);
	canvas.height="0";
	
}

//縦横比が4:6になるよう調整する関数
function setaspect(){
	
	castration = (height / 4) * 6;
	cropwidth = (width-castration)/2+5;
	
}

//端っこの切り落としをする関数
function ketsucrop (imgsrc){

	if (canvas.getContext) {
		
		initcropper();
		
		//計算処理
		if(width != 0 || height != 0){

			setaspect();
			
			canvas.width = castration;
			canvas.height = height;

			//一時的にcanvasに描画する
			ctx.drawImage(image, cropwidth, 0, castration-5, height, 0, 0, castration, height);
			
			convertcanvas2png();

		}
	}
}

//端っこをくっつける関数
function ketsuadd (imgsrc){

	//比率を固定するために一度切り抜く
	if (canvas.getContext) {

		initcropper();

		//計算処理
		if(width != 0 || height != 0){

			setaspect();

			addimageL.src = "./assets/images/ketsu"+ episodenum +"L.png";
			addimageR.src = "./assets/images/ketsu"+ episodenum +"R.png";

			addimageL.addEventListener('load', function() {
				addimageR.addEventListener('load', function() {

					resizewidth = addimageL.height/4*6;

					canvas.width = resizewidth+(addimageL.width*2);
					canvas.height = addimageL.height;

					//一時的にcanvasに描画する
					ctx.drawImage(image, cropwidth, 0, castration-5, height, addimageL.width, 0, resizewidth, addimageL.height);
					ctx.drawImage(addimageL, 0, 0);
					ctx.drawImage(addimageR, addimageL.width+resizewidth, 0);

					convertcanvas2png();

				});
			});

		}
	}

}

//記念撮影をする関数
function compicshot (imgsrc){
	
	//比率を固定するために一度切り抜く
	if (canvas.getContext) {

		initcropper();

		//計算処理
		if(width != 0 || height != 0){

			setaspect();

			compic.src = "./assets/images/ketsudekapingu.png";

			compic.addEventListener('load', function() {

				canvas.width = compic.width;
				canvas.height = compic.height;

				//一時的にcanvasに描画する
				ctx.drawImage(image, 0, 0, compic.width, compic.height, 0, 0, compic.width, compic.height);
				ctx.drawImage(compic, 0, 0);

				convertcanvas2png();

			});

		}
	}
}

//---html要素コントロール関数---//
function optiontoggle(){
	$('.optionsettings').slideToggle('slow');
}

function episodetoggle(){
	$('.optionepisode').slideToggle('slow');
}

//未実装部
/*
function tweetpost(){
	var s;	//Tweet内容を格納する変数
	var EUC = encodeURIComponent;
	var twitter_url = "http://twitter.com/?status=";

	//Tweet内容
	s = "KETSUDEKA CROPPER";

	if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
		location.href = 'https://twitter.com/intent/tweet?text=' + EUC(s);
	}else{
		window.open(twitter_url + EUC(s), "_blank","top=50,left=50,width=500,height=500,scrollbars=1,location=0,menubar=0,toolbar=0,status=1,directories=0,resizable=1");
	}
}
*/
