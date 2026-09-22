export default function Oscilloscope() {
  return (
    <svg className="h-10 w-full text-cyan/70" viewBox="0 0 1200 80" fill="none" aria-hidden="true">
      <path
        className="scope-wave"
        d="M0 40 C 40 40, 60 8, 90 40 S 140 72, 180 40 S 230 8, 270 40 S 320 72, 360 40 S 410 8, 450 40 S 500 72, 540 40 S 590 8, 630 40 S 680 72, 720 40 S 770 8, 810 40 S 860 72, 900 40 S 950 8, 990 40 S 1040 72, 1080 40 S 1130 8, 1170 40 S 1200 40, 1200 40"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
