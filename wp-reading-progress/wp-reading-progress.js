var ruigehond006_h = 0, // this caches the window height
    ruigehond006_f = 0, // the correction of height when mark_it_zero (or 0 otherwise)
    ruigehond006_a = null, // the element the reading bar is attached to (with fallback to top)
    ruigehond006_t = 0, // the top value (set to below the admin bar when necessary)
    ruigehond006_timer; // holding the timeout for the position function
if (document.readyState !== 'loading') {
    ruigehond006_start();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        ruigehond006_start();
    });
}

function ruigehond006_start() {
    if (typeof ruigehond006_c === 'undefined') return;
    // custom object ruigehond006_c is placed by wp_localize_scripts in wp-reading-progress.php and should be present for the progress bar
    (function ($) {
        var $p = $(ruigehond006_c.post_identifier),
            p, p_candidates;
        if ($p.length !== 1) { // when not found, try to get the current post by id
            $p = $('#post-' + ruigehond006_c.post_id);
        }
        if ($p.length === 1) {
            p = $p[0];
        } else {
            p = document.body;
        }
        if (!ruigehond006_c.include_comments) {// check if it has the internal content in a standard class
            if ((p_candidates = p.querySelectorAll('.entry-content')).length === 1) {
                p = p_candidates[0];
            } else if ((p_candidates = p.querySelectorAll('.post-content')).length === 1) {
                p = p_candidates[0];
            } else if ((p_candidates = p.querySelectorAll('.main-content')).length === 1) {
                p = p_candidates[0];
            }
        }
        ruigehond006_check_and_place_bar(p);
        $(window).on('load scroll', function () {
            ruigehond006_progress(p);
        }).on('resize', function () {
            ruigehond006_check_and_place_bar(p); // will call progress function
        });
    })(jQuery);
}

function ruigehond006_progress(p) {
    // loc.height in pixels = total amount that can be read
    var loc = p.getBoundingClientRect(),
        loc_height = loc.height - ruigehond006_f,
        reading_left = Math.max(Math.min(loc.bottom - ruigehond006_h, loc_height), 0), // in pixels
        reading_done = 100 * (loc_height - reading_left) / loc_height; // in percent
    document.getElementById('ruigehond006_bar').style.width = reading_done + '%';
    ruigehond006_position();
}

function ruigehond006_position() {
    var wrap_style = document.getElementById('ruigehond006_wrap').style, rect;
    clearTimeout(ruigehond006_timer);
    if (ruigehond006_a) { // position below the element
        rect = ruigehond006_a.getBoundingClientRect();
        if (rect.bottom < ruigehond006_t) {
            wrap_style.top = ruigehond006_t; // switch to top if the element is out of reach
        } else {
            wrap_style.top = rect.bottom.toString() + 'px';
            wrap_style.left = rect.left.toString() + 'px';
            wrap_style.width = rect.width.toString() + 'px';
        }
    } else if (ruigehond006_c.bar_attach === 'top') {
        document.getElementById('ruigehond006_wrap').style.top = ruigehond006_t.toString() + 'px';
    }
    ruigehond006_timer = setTimeout(ruigehond006_position, 475);
}

function ruigehond006_check_and_place_bar(p) {
    (function ($) {
        var $adminbar = $('#wpadminbar');
        ruigehond006_a = ((ruigehond006_a = $(ruigehond006_c.bar_attach))) ? ruigehond006_a[0] : null;
        ruigehond006_h = $(window).height();
        if (typeof ruigehond006_c.mark_it_zero !== 'undefined') {
            ruigehond006_f = Math.max(ruigehond006_h - $(p).offset().top, 0); // math.max for when article is off screen
        }
        // attach the bar to DOM (body) if not already there, you only have to do this once
        if (!document.getElementById('ruigehond006_bar')) {
            document.body.insertAdjacentHTML('beforeend',
                '<div id="ruigehond006_wrap"><div id="ruigehond006_bar" role="progressbar"></div></div>');
            $('#ruigehond006_bar').css({'background-color': ruigehond006_c.bar_color});
            setTimeout(function () {
                $('#ruigehond006_wrap').css({'height': ruigehond006_c.bar_height});
            }, 500);
        }
        // the checking of the attach-to element is moved to the progress function because scrolling can influence that
        if (ruigehond006_c.bar_attach === 'bottom') {
            $('#ruigehond006_wrap').css({
                'position': 'fixed',
                'bottom': '0',
                'left': '0',
            });
        } else {
            $('#ruigehond006_wrap').css({
                'position': 'fixed',
                'left': '0',
            });
        }
        if ($adminbar.length > 0 && $adminbar.css('position') === 'fixed') {
            ruigehond006_t = $adminbar.outerHeight(); // default is '0'
        }
        ruigehond006_progress(p);
    })(jQuery);
}