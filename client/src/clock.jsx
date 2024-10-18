import React, { useEffect, useState } from 'react';
import './clock.css'; // Ensure this file is in the same directory

const FlipClock = () => {
  const [amPm, setAmPm] = useState('');

  useEffect(() => {
    run();
  }, []);

  const run = () => {
    const els = {
      s: initElements("s"),
      m: initElements("m"),
      h: initElements("h"),
    };

    function initElements(type) {
      const els = [{}, {}];

      if (!["s", "m", "h"].includes(type)) return els;

      const target = document.querySelector(`.flip-clock-${type}`);

      if (!target) return els;

      let el;

      el = els[0];
      el.digit = target.querySelector(".digit-left");
      el.card = el.digit.querySelector(".carden");
      el.cardFaces = el.card.querySelectorAll(".card-face");
      el.cardFaceA = el.cardFaces[0];
      el.cardFaceB = el.cardFaces[1];

      el = els[1];
      el.digit = target.querySelector(".digit-right");
      el.card = el.digit.querySelector(".carden");
      el.cardFaces = el.card.querySelectorAll(".card-face");
      el.cardFaceA = el.cardFaces[0];
      el.cardFaceB = el.cardFaces[1];

      return els;
    }

    (function runClock() {
      const date = new Date();
      let now = {
        h: date.getHours() % 12 || 12, // Convert to 12-hour format
        m: date.getMinutes(),
        s: date.getSeconds(),
      };

      // Set AM/PM
      setAmPm(date.getHours() >= 12 ? 'PM' : 'AM');

      now.h = String(now.h).padStart(2, '0');
      now.m = String(now.m).padStart(2, '0');
      now.s = String(now.s).padStart(2, '0');
      now.h0 = now.h[0];
      now.h1 = now.h[1];
      now.m0 = now.m[0];
      now.m1 = now.m[1];
      now.s0 = now.s[0];
      now.s1 = now.s[1];

      for (const t of Object.keys(els)) {
        for (const i of ["0", "1"]) {
          const curr = now[`${t}${i}`];
          let next = +curr + 1;
          if (t === "h") {
            if (i === "0") next = next <= 2 ? `${next}` : "0";
            if (i === "1") next = next <= 3 ? `${next}` : "0";
          }
          if (t === "m") {
            if (i === "0") next = next <= 5 ? `${next}` : "0";
            if (i === "1") next = next <= 9 ? `${next}` : "0";
          }
          if (t === "s") {
            if (i === "0") next = next <= 5 ? `${next}` : "0";
            if (i === "1") next = next <= 9 ? `${next}` : "0";
          }
          const el = els[t][i];
          if (el && el.digit) {
            if (!el.digit.dataset.digitBefore) {
              el.digit.dataset.digitBefore = curr;
              el.cardFaceA.textContent = el.digit.dataset.digitBefore;
              el.digit.dataset.digitAfter = next;
              el.cardFaceB.textContent = el.digit.dataset.digitAfter;
            } else if (el.digit.dataset.digitBefore !== curr) {
              el.card.addEventListener(
                "transitionend",
                function () {
                  el.digit.dataset.digitBefore = curr;
                  el.cardFaceA.textContent = el.digit.dataset.digitBefore;

                  const cardClone = el.card.cloneNode(true);
                  cardClone.classList.remove("flipped");
                  el.digit.replaceChild(cardClone, el.card);
                  el.card = cardClone;
                  el.cardFaces = el.card.querySelectorAll(".card-face");
                  el.cardFaceA = el.cardFaces[0];
                  el.cardFaceB = el.cardFaces[1];

                  el.digit.dataset.digitAfter = next;
                  el.cardFaceB.textContent = el.digit.dataset.digitAfter;
                },
                { once: true }
              );
              if (!el.card.classList.contains("flipped")) {
                el.card.classList.add("flipped");
              }
            }
          }
        }
      }

      setTimeout(runClock, 1000);
    })();
  };

  return (
    <div id="app" className='darke'>
      <div className="flip-clock-container">
        <div className="flip-clock flip-clock-h">
          <div className="digit digit-left">
            <div className="carden">
              <div className="card-face card-face-front"></div>
              <div className="card-face card-face-back"></div>
            </div>
          </div>
          <div className="digit digit-right">
            <div className="carden">
              <div className="card-face card-face-front"></div>
              <div className="card-face card-face-back"></div>
            </div>
          </div>
        </div>

        <div className="colon">:</div>

        <div className="flip-clock flip-clock-m">
          <div className="digit digit-left">
            <div className="carden">
              <div className="card-face card-face-front"></div>
              <div className="card-face card-face-back"></div>
            </div>
          </div>
          <div className="digit digit-right">
            <div className="carden">
              <div className="card-face card-face-front"></div>
              <div className="card-face card-face-back"></div>
            </div>
          </div>
        </div>

        <div className="colon">:</div>

        <div className="flip-clock flip-clock-s">
          <div className="digit digit-left">
            <div className="carden">
              <div className="card-face card-face-front"></div>
              <div className="card-face card-face-back"></div>
            </div>
          </div>
          <div className="digit digit-right">
            <div className="carden">
              <div className="card-face card-face-front"></div>
              <div className="card-face card-face-back"></div>
            </div>
          </div>
        </div>

        {/* AM/PM Indicator */}
        <div className="ampm-indicator">{amPm}</div>
      </div>
    </div>
  );
};

export default FlipClock;
