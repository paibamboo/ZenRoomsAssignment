var dataFactory = function () {
    function createXHR() {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        return xhr;
    }

    var updateRoomData = function (date, month, year, roomType, label, value) {

    }();

    var getRoomsData = function (month, year) {
        var xhr = createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.responseText;
            }
        };
        //xhr.open('GET', 'api/rooms', true);
        //xhr.send();

        //dummy data
        var dd = new Date(year, month + 1, 0);
        var numOfDays = dd.getDate();
        var result = [];
        for (var i = 0; i < numOfDays; i++) {
            var obj = {
                Date: '',
                Rooms: [
                    {
                        Type: 'Double',
                        Avail: 5,
                        Price: 100
                    },
                    {
                        Type: 'Single',
                        Avail: 5,
                        Price: 20
                    }
                ]
            };
            result.push(obj);
        }
        return result;
        //end dummy
    };

    return {
        getRoomsData: getRoomsData,
        updateRoomData: updateRoomData
    };
}();