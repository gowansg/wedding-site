(function() {
  function init() {
    var guestNameElement = document.getElementById('rsvp-guest-name'),
        guestNameInput = document.getElementById('rsvp-guest-name-input'),
        rsvp = document.getElementById('rsvp'),
        invitationSelect = rsvp.querySelector('select'),
        additionalGuestsSelect = document.getElementById('rsvp-additional-guests'),
        submitButton = document.getElementById('rsvp-submit-button');

    function setGuestName() {
      guestNameElement.textContent = guestNameInput.value;
    }

    guestNameInput.addEventListener('blur', setGuestName);
    invitationSelect.addEventListener('change', toggleAdditionalDetails);
    additionalGuestsSelect.addEventListener('change', displayAdditionalGuestsInfo);
    submitButton.addEventListener('click', submit);

    setGuestName();
    rsvp.style.visibility = 'visible';
  }

  function toggleAdditionalDetails(event) {
    var details = document.getElementById("rsvp-additional-details"),
        hidden = event.target.value < 0;

    if (hidden) {
      hide(details);
    }
    else {
      show(details);
    }
  }

  function displayAdditionalGuestsInfo(event) {
    var guestsValue = event.target.value,
        familyInfo = document.getElementById('rsvp-additional-guests-family'),
        dateInfo = document.getElementById('rsvp-additional-guests-date');

    if (guestsValue == 2) {
      show(dateInfo);
      hide(familyInfo);
    }
    else if (guestsValue == 3) {
      show(familyInfo);
      hide(dateInfo);
    }
    else {
      hide(dateInfo);
      hide(familyInfo);
    }
  }

  function hide(elem) {
    elem.classList.remove('show--ease-in');
    elem.classList.add('hidden--linear');

    setTimeout(function() {
      elem.style.display = 'none';
    }, 500);
  }

  function show(elem) {
    elem.classList.add('show--ease-in');
    elem.classList.remove('hidden--linear');

    setTimeout(function() {
      elem.style.display = '';
    }, 500);
  }

  function buildPostData(form) {
    return [].filter.call(form.elements, function(el) {
      return el.offsetHeight > 0 &&
             (el.checked || el.value || /select/gi.test(el.type));
    })
    .map(function(el) {
      return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
    })
    .join('&');
  }

  function submit() {
    var request = new XMLHttpRequest(),
        rsvpForm = document.getElementById('rsvp'),
        data = buildPostData(rsvpForm),
        response;

    console.log(data);

    request.open('POST', '/rsvp');
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded; charset=UTF-8');
    request.onreadystatechange = function() {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          response = JSON.parse(request.response);
          displayRsvpResponse(response);
        }
        else {
          console.error('Submission ajax error:' + request.status);
        }
      }
    };
    request.send(data);
  }

  function displayRsvpResponse(response) {
    var messageSpan = document.getElementById('rsvp-submission-message'),
        errors,
        success;

    if (!response || !response.messages) {
      return;
    }

    if (response.messages.length > 0) {
      errors = response.messages.map(function (message) {
        return "<li>" + message + "</li>";
      })
      .join("\r\n");

      messageSpan.innerHTML = "<ul>" + errors + "</ul>";
    }
    else {
      success = "Thanks for sending the RSVP! " +
        (response.attending ?
        "We'll see you there!" :
        "We're sorry you can't make it, but we understand. :)");

      messageSpan.innerHTML = "<span>" + success + "</span>";
      document.getElementById('rsvp-submit-button').disabled = true;
    }
  }
  init();
})();
