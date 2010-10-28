var _IMC = {
	path: "http://dzx.webim20.cn/source/plugin/webim/",
	version: ""
};
//_IMC.questions =  [["0", "安全提问(未设置请忽略)"], ["1", "母亲的名字"], ["2", "爷爷的名字"], ["3", "父亲出生的城市"], ["4", "你其中一位老师的名字"], ["5", "你个人计算机的型号"], ["6", "你最喜欢的餐馆名称"], ["7", "驾驶执照最后四位数字"]];
_IMC.notice =  "请使用 dzx.webim20.cn 帐号登录";
( function( webim ) {
	var path = _IMC.path;
	var webim = window.webim;
	webim.route( {
		online: path + "im.php?webim_action=online",
		offline: path + "im.php?webim_action=offline",
		deactivate: path + "im.php?webim_action=refresh",
		message: path + "im.php?webim_action=message",
		presence: path + "im.php?webim_action=presence",
		status: path + "im.php?webim_action=status",
		history: path + "im.php?webim_action=history",
		clear: path + "im.php?webim_action=clear_history",
		download: path + "im.php?webim_action=download_history",
		setting: path + "im.php?webim_action=setting",
		members: path + "im.php?webim_action=members",
		join: path + "im.php?webim_action=join",
		leave: path + "im.php?webim_action=leave",
		buddies: path + "im.php?webim_action=buddies",
		notifications: path + "im.php?webim_action=notifications"
	} );

	webim.ui.emot.init( { "dir": "app:/static/images/emot/default" } );
	var soundUrls = {
		lib: "app:/static/assets/sound.swf",
		msg: "app:/static/assets/sound/msg.mp3"
	};
	webim.ui.window.defaults.layout = "app:/air.window.html";
	var ui = new webim.ui( document.body, {
		soundUrls: soundUrls,
		layoutOptions: {
			loginOptions: {
				questions: _IMC.questions,
				notice: _IMC.notice
			}
		}
	}), im = ui.im;
	ui.addApp( "buddy" );
	ui.addApp( "room" );
	ui.layout.showWidget( "buddy" );
	ui.render();
} )( webim );

