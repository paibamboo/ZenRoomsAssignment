
var updatePopup = function () {

    function saveValue(span, date, month, year, roomType, label, val) {
        //dummy alert, will need to use dataFactory
        //alert('when = ' + date + '/' + month + '/' + year + ', roomType = ' + roomType + ', label = ' + label + ', val = ' + value);
        span.innerHTML = '<img src="img/loading-icon2.gif" style="vertical-align: middle; margin-bottom: 3px;" />';
        setTimeout(function () {
            span.innerHTML = val;
            span.dataset.val = val;
        }, 2000);
    }

    var drawPopup = function (span, x, y, date, month, year, roomType, label, val) {
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
            if (e.keyCode === 13) saveValue(span, date, month, year, roomType, label, input.value);
        });

        var checkDiv = document.createElement('div');
        var checkImg = document.createElement('img');
        checkImg.addEventListener('click', function (e) {
            saveValue(span, date, month, year, roomType, label, input.value);
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
    };

    return {
        drawPopup: drawPopup
    };
}();

window.onload = function () {
    var curDatesContainerWidth = document.getElementById('all-dates-container').offsetWidth;
    var isTerminal = false;

    function navLeft() {
        var overflowPanel = document.getElementById('all-dates');
        var style = overflowPanel.style || window.getComputedStyle(overflowPanel);
        var marginLeft = parseInt(style.marginLeft);
        var widthToMove = 140;
        if (window.innerWidth >= 768) widthToMove = 350;

        // when the sliding of the div is almost finished (the last sliding), the last sliding needs to move to an exact edge of div.
        if (marginLeft < 0 && marginLeft >= -widthToMove) {
            overflowPanel.style.marginLeft = '0px';
        }
            // in normal case, the sliding moves the div by 'widthToMove' px.
        else if (marginLeft < -widthToMove) {
            var result = marginLeft + widthToMove;
            overflowPanel.style.marginLeft = result + 'px';
        }
            // when the div is at its edge, but a user still navigates left, the sliding will move the div to the right and then the left(same position)
            // to show that the user has reached the edge of the div
        else if (marginLeft === 0) {
            overflowPanel.style.marginLeft = (marginLeft + 30) + 'px';
            setTimeout(function () { overflowPanel.style.marginLeft = marginLeft + 'px' }, 150);
        }
        isTerminal = false;
    }

    function navRight() {
        var overflowPanel = document.getElementById('all-dates');
        var style = overflowPanel.style || window.getComputedStyle(overflowPanel);
        var marginLeft = parseInt(style.marginLeft);
        var entireWidth = overflowPanel.offsetWidth;
        var containerWidth = document.getElementById('all-dates-container').offsetWidth;
        var widthToMove = 140;
        if (window.innerWidth >= 768) widthToMove = 350;

        // when the sliding of the div is almost finished (the last sliding), the last sliding needs to move to an exact edge of div.
        if (Math.abs(marginLeft) >= (entireWidth - (containerWidth + widthToMove))
                && Math.abs(marginLeft) < (entireWidth - containerWidth)
                && (entireWidth - (containerWidth + widthToMove)) >= 0) {
            overflowPanel.style.marginLeft = (containerWidth - entireWidth) + 'px';
            isTerminal = true;
        }
            // in normal case, the sliding moves the div by 'widthToMove' px.
        else if (Math.abs(marginLeft) < (entireWidth - (containerWidth + widthToMove))) {
            var result = marginLeft - widthToMove;
            overflowPanel.style.marginLeft = result + 'px';
            isTerminal = false;
        }
            // when the div is at its edge, but a user still navigates right, the sliding will move the div to the right and then the left(same position)
            // to show that the user has reached the edge of the div
        else if (marginLeft === containerWidth - entireWidth) {
            overflowPanel.style.marginLeft = (marginLeft - 30) + 'px';
            setTimeout(function () { overflowPanel.style.marginLeft = marginLeft + 'px' }, 150);
            isTerminal = true;
        }
    }

    function setCalendar(date) {
        if (date) calendar.setCurDate(date);
        else date = calendar.getCurDate();

        var allDates = document.getElementById('all-dates');
        var navLeftContainer = document.getElementsByClassName('date-nav-left-container')[0];
        var navRightContainer = document.getElementsByClassName('date-nav-right-container')[0];
        var calHeading = document.getElementById('cal-heading');

        calHeading.innerHTML = calendar.getMonthName(date.getMonth()) + ' ' + date.getFullYear();
        navLeftContainer.style.display = 'none';
        navRightContainer.style.display = 'none';
        allDates.innerHTML = '';
        allDates.style.textAlign = 'center';
        allDates.style.paddingTop = '60px';
        allDates.style.width = '100%';
        allDates.className = '';
        setTimeout(function () { allDates.className = 'transition-margin-left'; }, 500);
        allDates.style.marginLeft = '0px';
        allDates.innerHTML = '<img src="img/loading-icon.gif" />';

        dataFactory.getRoomsData(date.getMonth(), date.getFullYear(), function (data) {
            navLeftContainer.style.display = 'block';
            navRightContainer.style.display = 'block';
            allDates.style.textAlign = 'inherit';
            allDates.style.paddingTop = '0';
            allDates.style.width = calendar.getNumDaysOfMonth(date) * 70 + 'px';
            allDates.innerHTML = calendar.drawCal(data, date.getMonth(), date.getFullYear());
            var cols = document.getElementsByClassName('open-update-popup');
            for (var i = 0; i < cols.length; i++) {
                cols[i].addEventListener('click', function (e) {
                    updatePopup.drawPopup(this, e.clientX, e.clientY, this.dataset.date, this.dataset.month, this.dataset.year, this.dataset.roomType, this.dataset.label, this.dataset.val);
                });
            }
        }, function (errorText) {
            allDates.innerHTML = '';
            alert(errorText);
        });
    }

    window.addEventListener('resize', function () {
        var newDatesContainerWidth = document.getElementById('all-dates-container').offsetWidth;
        if (newDatesContainerWidth > curDatesContainerWidth && isTerminal) {
            var curMarginLeft = parseInt(document.getElementById('all-dates').style.marginLeft);
            var newMarginLeft = curMarginLeft + (newDatesContainerWidth - curDatesContainerWidth);
            if (newMarginLeft > 0) newMarginLeft = 0;
            document.getElementById('all-dates').style.marginLeft = newMarginLeft + 'px';
        }
        curDatesContainerWidth = newDatesContainerWidth;
    });

    document.getElementsByClassName('date-nav-left-container')[0].addEventListener('click', navLeft);
    document.getElementsByClassName('date-nav-right-container')[0].addEventListener('click', navRight);
    document.getElementById('month-nav-left').addEventListener('click', function () {
        var curDate = calendar.getCurDate();
        var newMonth, newYear;
        var curMonth = newMonth = curDate.getMonth();
        var curYear = newYear = curDate.getFullYear();
        if (curMonth - 1 === -1) {
            newMonth = 11;
            newYear -= 1;
        } else {
            newMonth -= 1;
        }
        var newDate = new Date(newYear, newMonth, 1);
        setCalendar(newDate);
    });
    document.getElementById('month-nav-right').addEventListener('click', function () {
        var curDate = calendar.getCurDate();
        var newMonth, newYear;
        var curMonth = newMonth = curDate.getMonth();
        var curYear = newYear = curDate.getFullYear();
        if (curMonth + 1 === 12) {
            newMonth = 0;
            newYear += 1;
        } else {
            newMonth += 1;
        }
        var newDate = new Date(newYear, newMonth, 1);
        setCalendar(newDate);
    });

    setCalendar();
};