
var calendar = function () {
    var curDate = new Date();

    function getDatesInMonth(month, year) {
        var date = new Date(year, month, 1);
        var dates = [];
        while (date.getMonth() === month) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }

    function drawDateCol(date) {
        return '<div class="col-part' + ((date.getDay() === 0 || date.getDay() === 6) ? ' weekend' : '') + '">' + getDayOfWeek(date.getDay()).substring(0, 3) + ' ' + date.getDate() + '</div>';
    }

    function drawPriceOrAvailCol(date, roomType, label, val) {
        return '<div class="col-part" style="position:relative;">' + '<span class="open-update-popup clickable" data-date-str="' + toISOString(date) +
            '" data-room-type="' + roomType + '" data-label="' + label + '" data-val="' + val + '">' + val + '</span></div>';
    }

    function toISOString(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    var drawCal = function (data, month, year) {
        if (!month || !year) {
            month = curDate.getMonth();
            year = curDate.getFullYear();
        }

        var dateRow, singlePriceRow, singleAvailRow, doublePriceRow, doubleAvailRow;
        dateRow = '<div class="row border-btm">';
        singlePriceRow = singleAvailRow = doublePriceRow = doubleAvailRow = '<div class="row">';
        var dates = getDatesInMonth(month, year);
        var tracker = 0;

        for (var i = 0; i < dates.length; i++) {
            dateRow += drawDateCol(dates[i]);

            var defaultDoubleAvailRow, defaultDoublePriceRow, defaultSingleAvailRow, defaultSinglePriceRow;
            defaultDoubleAvailRow = drawPriceOrAvailCol(dates[i], 'Double', 'Avail', 5);
            defaultDoublePriceRow = drawPriceOrAvailCol(dates[i], 'Double', 'Price', 'N/A');
            defaultSingleAvailRow = drawPriceOrAvailCol(dates[i], 'Single', 'Avail', 5);
            defaultSinglePriceRow = drawPriceOrAvailCol(dates[i], 'Single', 'Price', 'N/A');

            if (data[tracker] && toISOString(dates[i]) === data[tracker].Date) {
                for (var j = 0; j < data[tracker].Rooms.length; j++) {
                    var room = data[tracker].Rooms[j];
                    if (room.RoomType === 'Double') {
                        defaultDoubleAvailRow = drawPriceOrAvailCol(dates[i], room.RoomType, 'Avail', room.Availability || 5);
                        defaultDoublePriceRow = drawPriceOrAvailCol(dates[i], room.RoomType, 'Price', room.Price ? parseFloat(room.Price).toFixed(2) : 'N/A');
                    } else if (room.RoomType === 'Single') {
                        defaultSingleAvailRow = drawPriceOrAvailCol(dates[i], room.RoomType, 'Avail', room.Availability || 5);
                        defaultSinglePriceRow = drawPriceOrAvailCol(dates[i], room.RoomType, 'Price', room.Price ? parseFloat(room.Price).toFixed(2) : 'N/A');
                    }
                }
                tracker++;
            }

            doubleAvailRow += defaultDoubleAvailRow;
            doublePriceRow += defaultDoublePriceRow;
            singleAvailRow += defaultSingleAvailRow;
            singlePriceRow += defaultSinglePriceRow;

            if (i === dates.length - 1) {
                dateRow += '</div>';
                doubleAvailRow += '</div>';
                doublePriceRow += '</div>';
                singleAvailRow += '</div>';
                singlePriceRow += '</div>';
            }
        }

        var result = dateRow + '<div class="row"></div>' + doubleAvailRow + doublePriceRow + '<div class="row"></div>' + singleAvailRow + singlePriceRow;
        return result;
    };

    var getDayOfWeek = function (dayNum) {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum];
    };

    var getMonthName = function (monthNum) {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthNum];
    };

    var getNumDaysOfMonth = function (date) {
        return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    };

    var getCurDate = function () {
        return curDate;
    };

    var setCurDate = function (date) {
        curDate = date;
    };

    return {
        drawCal: drawCal,
        getDayOfWeek: getDayOfWeek,
        getMonthName: getMonthName,
        getNumDaysOfMonth: getNumDaysOfMonth,
        getCurDate: getCurDate,
        setCurDate: setCurDate
    };
}();