// TODO: 用户名称需修改为自己的名称
    var userName = '蚀月';
// 朋友圈页面的数据
    var data =
        [
            {
                user: {
                    name: '阳和',
                    avatar: './img/avatar2.png'
                },
                content: {
                    type: 0, // 多图片消息
                    text: '华仔真棒，新的一年继续努力！',//朋友圈发表的文字
                    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],//图片
                    share: {},
                    timeString: '3分钟前'
                },
                reply: {
                    hasLiked: false,
                    likes: ['Guo封面', '源小神'],
                    comments: [{
                        author: 'Guo封面',
                        text: '你也喜欢华仔哈！！！'
                    }, {
                        author: '喵仔zsy',
                        text: '华仔实至名归哈'
                    }]
                }
            },
            /*******************************************************************************/
            {
                user: {
                    name: '伟科大人',
                    avatar: './img/avatar3.png'
                },
                content: {
                    type: 1, // 分享消息
                    text: '全民读书日',
                    pics: [],
                    share: {
                        pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
                        text: '飘洋过海来看你'
                    },
                    timeString: '50分钟前'
                },
                reply: {
                    hasLiked: false,
                    likes: ['阳和'],
                    comments: []
                }
            },
            /*******************************************************************************/
            {
                user: {
                    name: '深圳周润发',
                    avatar: './img/avatar4.png'
                },
                content: {
                    type: 2, // 单图片消息
                    text: '很好的色彩',
                    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
                    share: {},
                    timeString: '一小时前'
                },
                reply: {
                    hasLiked: false,
                    likes: [],
                    comments: []
                }
            },
            /*******************************************************************************/
            {
                user: {
                    name: '喵仔zsy',
                    avatar: './img/avatar5.png'
                },
                content: {
                    type: 3, // 无图片消息
                    text: '以后咖啡豆不敢浪费了',
                    pics: [],
                    share: {},
                    timeString: '2个小时前'
                },
                reply: {
                    hasLiked: false,
                    likes: [],
                    comments: []
                }
            }
        ];
// 相关 DOM
    var $page = $('.page-moments');
    var $momentsList = $('.moments-list');

    /**
     * 点赞内容 HTML 模板
     * @param {Array} likes 点赞人列表
     * @return {String} 返回html字符串
     */
    function likesHtmlTpl(likes) {
        if (!likes.length) {
            return '';
        }
        var htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
        // 点赞人的html列表
        var likesHtmlArr = [];
        // 遍历生成
        for (var i = 0, len = likes.length; i < len; i++) {
            likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
        }
        // 每个点赞人以逗号加一个空格来相隔
        var likesHtmlText = likesHtmlArr.join(', ');
        htmlText.push(likesHtmlText);
        htmlText.push('</div>');
        return htmlText.join('');
    }

    /**
     * 评论内容 HTML 模板
     * @param {Array} likes 点赞人列表
     * @return {String} 返回html字符串
     */
    function commentsHtmlTpl(comments) {
        if (!comments.length) {
            return '';
        }
        var htmlText = ['<div class="reply-comment">'];
        for (var i = 0, len = comments.length; i < len; i++) {
            var comment = comments[i];
            htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
        }
        htmlText.push('</div>');
        return htmlText.join('');
    }

    /**
     * 评论点赞总体内容 HTML 模板
     * @param {Object} replyData 消息的评论点赞数据
     * @return {String} 返回html字符串
     */
    function replyTpl(replyData) {
        var htmlText = [];
        htmlText.push('<div class="reply-zone">');//评论列表开始
        htmlText.push(likesHtmlTpl(replyData.likes));
        htmlText.push(commentsHtmlTpl(replyData.comments));//评论列表结束
        htmlText.push('</div>');
        return htmlText.join('');
    }

    /******************************************3种消息展示start(第四种为空)*************************************************************/
    /**
     * 多张图片消息模版
     * @param {Object} pics 多图片消息的图片列表
     * @return {String} 返回html字符串
     */
    function multiplePicTpl(pics) {
        var htmlText = [];
        htmlText.push('<ul class="item-pic">');
        for (var i = 0, len = pics.length; i < len; i++) {
            htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
        }
        htmlText.push('</ul>');
        return htmlText.join('');
    }

    /**
     * 分享消息模版
     * @param {Object} share 分享
     * @return {String} 返回html字符串
     */
    function shareTpl(share) {
        var htmlText = [];
        htmlText.push('<div class="item-share">');
        htmlText.push('<img class="share-img"  src="' + share.pic + '">');
        htmlText.push('<p class="share-tt">' + share.text + '</p>');
        htmlText.push('</div>');
        return htmlText.join('');
    }

    /**
     * 单图片消息模版
     * @param {Object} pics 分享
     * @return {String} 返回html字符串
     */
    function onlyImgTpl(pics) {
        var htmlText = [];
        htmlText.push('<img class="item-only-img"  src="' + pics[0] + '">');
        return htmlText.join('');
    }

//*****************************************3种消息展示end(第四种为空)******************************************************
    /**
     * 循环：消息体
     * @param {Object} messageData 对象
     */
    function messageTpl(messageData) {
        var user = messageData.user;
        var content = messageData.content;
        var reply = messageData.reply;
        var htmlText = [];

        htmlText.push('<div class="moments-item" data-index="0">');//设置索引

        // 消息用户头像
        htmlText.push('<a class="item-left" href="#">');
        htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
        htmlText.push('</a>');
        // 消息右边内容
        htmlText.push('<div class="item-right">');
        // 消息内容-用户名称
        htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
        // 消息内容-文本信息
        htmlText.push('<p class="item-msg">' + content.text + '</p>');
        // 消息内容-图片列表
        var contentHtml = '';

        switch (content.type) {
            // 多图片消息
            case 0:
                contentHtml = multiplePicTpl(content.pics);
                break;
            case 1:
                // TODO: 实现分享消息
                contentHtml = shareTpl(content.share);
                break;
            case 2:
                // TODO: 实现单张图片消息
                contentHtml = onlyImgTpl(content.pics);
                break;
            case 3:
                // TODO: 实现无图片消息
                contentHtml = '';
                break;
        }
        htmlText.push(contentHtml);
        // 消息时间和回复按钮
        htmlText.push('<div class="item-ft">');
        htmlText.push('<span class="item-time">' + content.timeString + '</span>');
        ///////////////////////////////////////////////////////////////
        htmlText.push('<div class="item-reply-bg">');
        var oHasLiked = function () {
            var hasLiked = '';
            var arr = reply.likes;

            var result = $.inArray(userName, arr);//判断点赞数组里面有没有该用户自己
            if (result == -1) {
                hasLiked = '点赞'//没有的话显示点赞
            } else {
                hasLiked = '取消'//有的话显示取消
            }
            return hasLiked;
        }
        htmlText.push('<div class="item-reply-touchUp">');//点赞的触摸区域
        htmlText.push('<div class="icon-like">' + '</div>');

        htmlText.push('<div class="item-reply-iconName">' + oHasLiked() + '</div>');//点赞or取消
        htmlText.push('</div>');
        htmlText.push('<div class="item-reply-touchComment">');//评论的触摸区域
        htmlText.push('<div class="icon-comment">' + '</div>');
        htmlText.push('<div class="item-reply-iconName">' + "评论" + '</div>');
        htmlText.push('</div></div>');
        htmlText.push('<div class="item-reply-btn">');

        ///////////////////////////////////////////////////////////////
        htmlText.push('<span class="item-reply"></span>');
        htmlText.push('</div></div>');
        // 消息回复模块（点赞和评论）
        htmlText.push(replyTpl(messageData.reply));
        htmlText.push('</div></div>');
        return htmlText.join('');
    }


    /**
     * 页面渲染函数：render
     */
    function render() {
        // 展示data数组中的所有消息数据。
        // var messageHtml=null;
        var messageHtml = '';
        for (var i = 0, len = data.length; i < len; i++) {
            messageHtml += messageTpl(data[i], i);
        }
        $momentsList.html(messageHtml);
    }


    function replyPopup() {
        /* 点击评论按钮弹出来的小框 */
        $(".item-reply-btn").on('click', function (event) {//选中所有的小按钮
            var oReplyBg = $(this).siblings('.item-reply-bg');
            event.stopPropagation();//阻止事件冒泡

            if (oReplyBg.css("margin-right") == "-152px") {
                $('.item-reply-bg').css({"margin-right": '-152px'});//先把所有弹出来的送回去
                oReplyBg.css({"margin-right": '38px'});//再把点赞/评论框弹出来
            } else {
                oReplyBg.css({"margin-right": '-152px'});//把点赞/评论框送回去
            }
        });
        /*点击空白处评论弹出框复原*/
        $(document).on('click', function (event) {
            $('.item-reply-bg').css({"margin-right": '-152px'});
        });

        $(".item-reply-touchUp").on('click', function (event) {//点击点赞/评论的时候不会弹回去
            event.stopPropagation();//阻止事件冒泡
        });
    }
    var Oindex = '';

    function touchUp() {
        $('.item-reply-touchUp').on('click', function () {
            var oIndex = $(".item-reply-touchUp").index(this);//获取当前的索引

            var appendUser = $("div[data-index$='" + oIndex + "']").find(".reply-like");//获取点击该区域的点赞列表

            var upOrDown = $(this).find('.item-reply-iconName');//获取点赞or取消的样式（innerHTML）
            var arr = data[oIndex].reply.likes;//点赞列表数组

            if (upOrDown.html() == '点赞') {
                arr.push(userName);
            } else {
                arr.splice($.inArray(userName, arr), 1);
            }
            $('.item-reply-bg').css({"margin-right": '-152px'});

            init();
            //重新渲染页面init();
        });
    }

    /**
     * 发表评论函数
     * */
    function touchComment() {

        $('.item-reply-touchComment').on('click', function () {

            Oindex = $(".item-reply-touchComment").index(this);//获取索引
            $('.item-reply-bg').css({"margin-right": '-152px'});//点击后先把点击or评论缩回去
            $('.review-box-Shell').css('display', 'block');
            $(".review-box-input").focus();//获取焦点
        });

        $(".item-reply-btn").on('click', function (event) {
            $('.review-box-Shell').css('display', 'none');
        });
        $(document).on('click', function (event) {
            $('.review-box-Shell').css('display', 'none');
        });
        //点击点赞/评论的时候不会隐藏//点击最下面的评论框不会隐藏
        $(".item-reply-touchComment,.review-box").on('click', function (event) {
            event.stopPropagation();//阻止事件冒泡
        });
    }

    //发送按钮点击后触发的事件
    function sentMsg() {
        var oBtn = $(".review-box-sent");
        var oInput = $('.review-box-input');

        // 回车键事件-->这里没有考虑用户需要在评论的时候“按回车键文字换行”
        $(document).keypress(function(e) {

            if(e.which == 13) {
                jQuery(".review-box-sent").click();
            }
        });

        oBtn.on('click', function (event) {

            var inner = oInput.val();//获取点击的索引
            var review = data[Oindex].reply.comments;//获取评论列表
            if (inner !== '') {
                review.push({author: userName, text: inner});//把内容更新到评论数组中去
                $('.review-box-Shell').css('display', 'none');//评论输入框恢复隐藏状态
                oInput.val('');//把输入框的内容清空
                oBtn.css("background", "gray");
                init();
            }
        });
    }

    //监听评论发送按钮的状态
    function listenInput() {
        var oInput = $('.review-box-input');
        var oBtn = $(".review-box-sent");
        oInput.val('');//先把输入框的内容清空
        $(function () {

            //页面加载完毕后触发事件
            oInput.bind('input propertychange', function () {//时刻监听输入框的内容
                if (oInput.val() == '') {//如果内容是空的话禁止发送
                    oBtn.css("background", "gray");
                    oBtn.attr("disabled", true);//如果内容是空的话按钮无法点击
                }
                if (oInput.val() !== '') {
                    oBtn.css("background", "#52B229");
                    oBtn.attr("disabled", false);
                }
            });
        });
    }

    //图片点击
    function touchImg() {
        $(".pic-item,.item-only-img").on('click', function (event) {

            var oSrc = $(this)[0].src;//获取点击图片的src

            $(".bg-img-out").css("display", "block");//弹出隐藏的弹出层
            $(".bg-img").css("background-image", "url(" + oSrc + ")");//把路径赋值给弹出层的背景图片路径

            //点击恢复隐藏
            $(".bg-img").on('click', function (event) {
                $(".bg-img-out").css("display", "none");
                $(".bg-img").css("background-image", "url('')");//清空url
            });
        });
    }

    /*************************************************************************************************************************/
    /**
     * 页面绑定事件函数：bindEvent
     */
    function bindEvent() {
        // TODO: 完成页面交互功能事件绑定
        touchUp();
        touchComment();
        touchImg();
        sentMsg();
        listenInput();
        replyPopup();
    }

    /**
     * 页面入口函数：init
     * 1、根据数据页面内容
     * 2、绑定事件
     */
    function init() {
        // 渲染页面
        render();
        bindEvent();
    }
    init();

