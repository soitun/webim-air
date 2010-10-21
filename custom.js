var _IMC = {};
_IMC.path = "http://demo.webim20.cn/home/webim/";
	_IMC.version = "";
//_IMC.questions =  [["0", "安全提问(未设置请忽略)"], ["1", "母亲的名字"], ["2", "爷爷的名字"], ["3", "父亲出生的城市"], ["4", "你其中一位老师的名字"], ["5", "你个人计算机的型号"], ["6", "你最喜欢的餐馆名称"], ["7", "驾驶执照最后四位数字"]];
_IMC.notice =  "请使用demo.webim20.cn/home帐号登录";
(function(webim){
	var path = _IMC.path;
	var webim = window.webim;
	webim.defaults.urls = {
		online:path + "im.php?webim_action=online",
		offline:path + "im.php?webim_action=offline",
		message:path + "im.php?webim_action=message",
		presence:path + "im.php?webim_action=presence",
		refresh:path + "im.php?webim_action=refresh",
		status:path + "im.php?webim_action=status"
	};
	webim.setting.defaults.url = path + "im.php?webim_action=setting";
	webim.history.defaults.urls = {
		load: path + "im.php?webim_action=history",
		clear: path + "im.php?webim_action=clear_history",
		download: path + "im.php?webim_action=download_history"
	};
	webim.room.defaults.urls = {
		member: path + "im.php?webim_action=members",
		join: path + "im.php?webim_action=join",
		leave: path + "im.php?webim_action=leave"
	};
	webim.buddy.defaults.url = path + "im.php?webim_action=buddies";
	//webim.notification.defaults.url = path + "im.php?webim_action=notifications";

	webim.ui.emot.init({"dir": "app:/static/images/emot/default"});
	var soundUrls = {
		lib: "app:/static/assets/sound.swf",
		msg: "app:/static/assets/sound/msg.mp3"
	};
	webim.ui.window.defaults.layoutUrl = "app:/air.window.html";
	webim.ui.window.defaults.iconUrl = "app:/static/images/logo128.png";
	var ui = new webim.ui(document.body, {
		soundUrls: soundUrls,
		layoutOptions: {
			loginOptions: {
				questions: _IMC.questions,
				notice: _IMC.notice
			}
		},
		imOptions: {
			//jsonp: true
		}
	}), im = ui.im;
	//im.user({"uid":"1","id":"admin","nick":"admin","pic_url":"http:\/\/test.com\/project\/uc\/discuzX\/uc_server\/avatar.php?uid=0&size=small","url":"home.php?mod=space&uid=1"});
	//ui.addApp("menu", {"data": menu});
	//ui.layout.addShortcut( menu);
	ui.addApp( "buddy" );
	ui.addApp( "room" );
	//ui.addApp("notification");
	//ui.addApp("setting", {"data": webim.setting.defaults.data});
	ui.layout.showWidget( "buddy" );
	ui.render();
	//is_login && im.autoOnline() && im.online();
	//im.online();
})(webim);

