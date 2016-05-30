
window.onload = function () {
    var curDatesContainerWidth = document.getElementById('all-dates-container').offsetWidth;

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
        }
            // in normal case, the sliding moves the div by 'widthToMove' px.
        else if (Math.abs(marginLeft) < (entireWidth - (containerWidth + widthToMove))) {
            var result = marginLeft - widthToMove;
            overflowPanel.style.marginLeft = result + 'px';
        }
            // when the div is at its edge, but a user still navigates right, the sliding will move the div to the right and then the left(same position)
            // to show that the user has reached the edge of the div
        else if (marginLeft === containerWidth - entireWidth) {
            overflowPanel.style.marginLeft = (marginLeft - 30) + 'px';
            setTimeout(function () { overflowPanel.style.marginLeft = marginLeft + 'px' }, 150);
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
            var allDatesWidth = calendar.getNumDaysOfMonth(date) * 70;
            var minNiceMarginLeft = (allDatesWidth - document.getElementById('all-dates-container').offsetWidth) * -1;
            var niceMarginLeft = (date.getDate() * 70 - 70) * -1;
            niceMarginLeft = niceMarginLeft < minNiceMarginLeft ? minNiceMarginLeft : niceMarginLeft;

            navLeftContainer.style.display = 'block';
            navRightContainer.style.display = 'block';
            allDates.style.textAlign = 'inherit';
            allDates.style.paddingTop = '0';
            allDates.style.width = allDatesWidth + 'px';
            allDates.style.marginLeft = niceMarginLeft + 'px';
            allDates.innerHTML = calendar.drawCal(data, date.getMonth(), date.getFullYear());
            var cols = document.getElementsByClassName('open-update-popup');
            for (var i = 0; i < cols.length; i++) {
                cols[i].addEventListener('click', function (e) {
                    updatePopup.drawPopup(this, e.clientX, e.clientY, this.dataset.dateStr, this.dataset.roomType, this.dataset.label, this.dataset.val);
                });
            }
        }, function (errorText) {
            allDates.innerHTML = '';
            alert(errorText);
        });
    }

    window.addEventListener('resize', function () {
        var newDatesContainerWidth = document.getElementById('all-dates-container').offsetWidth;
        if (newDatesContainerWidth > curDatesContainerWidth) {
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