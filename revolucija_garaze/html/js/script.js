let currentVehicles = [];
let selectedIndex = -1;

$(document).ready(function () {
    window.addEventListener('message', function (event) {
        let data = event.data;

        // Old LUA sends { Vozila = [...] }
        if (data.Vozila) {
            $('body').fadeIn(300);
            $('#garage-name').text("GARAŽA");
            selectedIndex = -1;
            $('#btn-spawn').attr('disabled', true);
            currentVehicles = data.Vozila || [];

            if (currentVehicles.length == 0) {
                $('#empty-state').show();
                $('#main-car-info').hide();
                $('#side-list-items').html('<div style="padding:1.5vw; color:rgba(255,255,255,0.3); text-align:center; font-size:0.8vw;">TRENUTNO U OVOJ GARAŽI NEMATE VOZILA</div>');
            } else {
                $('#empty-state').hide();
                $('#main-car-info').show();
                renderList(currentVehicles);
                selectVehicle(0);
            }
        }

        // Old LUA sends { Zatvori = true }
        if (data.Zatvori) {
            $('body').fadeOut(200);
        }
    });

    $(document).keydown(function (e) {
        if (e.which == 27) closeUI();
    });
});

function handleSearch() {
    let searchText = $('#vehicle-search').val().toLowerCase();
    let filtered = currentVehicles.filter(veh => {
        let name = (veh.ime || "").toLowerCase();
        let plate = (veh.tablice || "").toLowerCase();
        return name.includes(searchText) || plate.includes(searchText);
    });
    renderList(filtered, true);
}

function closeUI() {
    $('body').fadeOut(200);
    $.post('https://' + GetParentResourceName() + '/Zatvori', JSON.stringify({}));
}

function renderList(vehicles, isFiltered = false) {
    let list = $('#side-list-items');
    list.empty();
    if (vehicles.length === 0) {
        list.append('<div style="padding:1vw 1.2vw; color:rgba(255,255,255,0.2); font-size:0.8vw;">NEMA VOZILA</div>');
        return;
    }
    vehicles.forEach((veh, i) => {
        let actualIndex = isFiltered ? currentVehicles.indexOf(veh) : i;
        let plate = veh.tablice || "NEMA";
        let name = veh.ime || "Vozilo";
        let activeClass = actualIndex === selectedIndex ? 'active' : '';

        let zapljenjenoLabel = "";
        if (veh.zapljenjeno && veh.zapljenjeno.status) {
            zapljenjenoLabel = `<div style="color: #ff4444; font-size: 0.6vw;">ZAPLJENJENO</div>`;
        }

        let item = `
            <div class="side-item ${activeClass}" id="side-item-${actualIndex}" onclick="selectVehicle(${actualIndex})">
                <div class="s-name">${name} ${zapljenjenoLabel}</div>
                <div class="s-plate">${plate}</div>
            </div>`;
        list.append(item);
    });
}

function selectVehicle(index) {
    if (index < 0 || index >= currentVehicles.length) return;
    selectedIndex = index;

    let veh = currentVehicles[index];
    let plate = veh.tablice || "NEMA";
    let name = veh.ime || "NEPOZNATO VOZILO";

    $('.side-item').removeClass('active just-selected');
    let $el = $(`#side-item-${index}`);
    $el.addClass('active just-selected');
    setTimeout(() => { $el.removeClass('just-selected'); }, 600);

    $('#car-name').text(name.toUpperCase());
    $('#car-plate').text("TABLICE: " + plate.toUpperCase());

    // Call Old LUA callback: UcitajVozilo
    $.post('https://' + GetParentResourceName() + '/UcitajVozilo', JSON.stringify({
        Vozilo: veh
    }));

    // Stats handling
    let fuel = 0;
    let engine = 1000;
    let body = 1000;

    if (veh.Gorivo) fuel = veh.Gorivo.Gorivo || 0;
    if (veh.Properties) {
        if (veh.Properties.engineHealth != undefined) engine = veh.Properties.engineHealth;
        if (veh.Properties.bodyHealth != undefined) body = veh.Properties.bodyHealth;
    }

    $('#car-fuel').text(Math.round(fuel) + "%");
    $('#car-engine').text(Math.round(engine / 10) + "%");
    $('#car-body').text(Math.round(body / 10) + "%");

    // UI Adjust for Impound
    if (veh.zapljenjeno && veh.zapljenjeno.status) {
        $('#btn-spawn').html(`PLATI KAZNU ($${veh.zapljenjeno.cijena}) <i class="bi bi-cash"></i>`);
        $('#btn-spawn').css('background', 'linear-gradient(90deg, #ff4444, #cc0000)');
    } else {
        $('#btn-spawn').html(`IZVADI VOZILO <i class="bi bi-box-arrow-up-right"></i>`);
        $('#btn-spawn').css('background', ''); // use default CSS
    }

    $('#btn-spawn').attr('disabled', false);
}

function spawnSelected() {
    if (selectedIndex === -1) return;
    let veh = currentVehicles[selectedIndex];

    if (veh.zapljenjeno && veh.zapljenjeno.status) {
        // Call Old LUA callback: PlatiKaznu
        $.post('https://' + GetParentResourceName() + '/PlatiKaznu', JSON.stringify({
            Vozilo: veh
        }));
    } else {
        // Call Old LUA callback: UzmiVozilo
        $.post('https://' + GetParentResourceName() + '/UzmiVozilo', JSON.stringify({
            Vozilo: veh
        }));
    }
}