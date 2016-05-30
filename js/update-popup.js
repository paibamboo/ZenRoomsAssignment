
var updatePopup = function () {

    var drawPopup = function (span, x, y, dateStr, roomType, label, val) {
        var body = document.body || document.getElementsByTagName('body')[0];

        var updatePopupContainer = document.createElement('div');
        updatePopupContainer.className = 'update-popup-container';
        updatePopupContainer.addEventListener('click', function () {
            body.removeChild(updatePopupContainer);
        });

        var updatePopupDiv = document.createElement('div');
        updatePopupDiv.className = 'update-popup';
        updatePopupDiv.style.left = (window.innerWidth - x >= 192 ? x : x - 192) + 'px';
        updatePopupDiv.style.top = (y - 50) + 'px';

        var input = document.createElement('input');
        input.type = 'text';
        input.value = val;
        input.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        input.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                body.removeChild(updatePopupContainer);
                span.innerHTML = '<img src="img/loading-icon2.gif" style="vertical-align: middle; margin-bottom: 3px;" />';
                dataFactory.updateRoomData(dateStr, roomType, label, input.value, function () {
                    span.innerHTML = span.dataset.label === 'Price' ? parseFloat(input.value).toFixed(2) : input.value;
                    span.dataset.val = input.value;
                }, function (error) {
                    alert(error);
                    if (error === 'Data is saved in our app, but failed to be updated in 3rd-party.') {
                        span.innerHTML = span.dataset.label === 'Price' ? parseFloat(input.value).toFixed(2) : input.value;
                        span.dataset.val = input.value;
                    } else {
                        span.innerHTML = span.dataset.val
                    }
                });
            }
        });

        var checkDiv = document.createElement('div');
        var checkImg = document.createElement('img');
        checkImg.addEventListener('click', function (e) {
            span.innerHTML = '<img src="img/loading-icon2.gif" style="vertical-align: middle; margin-bottom: 3px;" />';
            dataFactory.updateRoomData(dateStr, roomType, label, input.value, function (data) {
                span.innerHTML = input.value;
                span.dataset.val = input.value;
            }, function (error) {
                alert(error);
                span.innerHTML = span.dataset.val
            });
        });
        checkImg.src = 'img/check-icon.png';
        checkDiv.appendChild(checkImg);

        var closeDiv = document.createElement('div');
        var closeImg = document.createElement('img');
        closeImg.src = 'img/close-icon.png';
        closeDiv.appendChild(closeImg);

        updatePopupDiv.appendChild(input);
        updatePopupDiv.appendChild(checkDiv);
        updatePopupDiv.appendChild(closeDiv);
        updatePopupContainer.appendChild(updatePopupDiv);

        body.appendChild(updatePopupContainer);
        input.select();
    };

    return {
        drawPopup: drawPopup
    };
}();