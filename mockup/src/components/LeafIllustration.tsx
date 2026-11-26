/* A drawn sample leaf. Not a photograph, so it is labelled "অঙ্কিত নমুনা ছবি"
   everywhere it appears. Three variants differ only in how many spots they show. */

type Variant = 1 | 2 | 3;

const SPOTS: Record<Variant, Array<[number, number, number, number, number]>> = {
  1: [
    [62, 52, 7, 5, -18],
    [98, 80, 6, 4.5, 12],
    [72, 112, 5, 4, 8],
  ],
  2: [
    [58, 44, 7, 5, -22],
    [96, 58, 6, 4.5, 14],
    [70, 78, 7, 5, -8],
    [102, 100, 5.5, 4, 20],
    [64, 118, 5, 4, 6],
    [92, 128, 4.5, 3.5, -14],
  ],
  3: [
    [56, 38, 7, 5, -24],
    [92, 44, 6, 4.5, 10],
    [66, 60, 7, 5, -6],
    [104, 68, 5.5, 4, 22],
    [76, 84, 7, 5, 4],
    [100, 96, 6, 4.5, -12],
    [60, 104, 5.5, 4, 16],
    [88, 116, 5, 4, -20],
    [70, 132, 4.5, 3.5, 8],
  ],
};

const VEINS = [0, 1, 2, 3, 4, 5];

export function LeafIllustration({ variant }: { variant: Variant }) {
  const gradientId = `leaf-gradient-${variant}`;

  return (
    <svg className="leaf" viewBox="0 0 160 200" role="img" aria-label="অঙ্কিত নমুনা পাতা">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#93ca6f" />
          <stop offset="1" stopColor="#4e8b3b" />
        </linearGradient>
      </defs>

      <path
        d="M80 192c0-24 0-40 0-46"
        fill="none"
        stroke="#4b7a34"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M80 150C42 118 36 62 80 14c44 48 38 104 0 136Z" fill={`url(#${gradientId})`} />
      <path d="M80 150V20" fill="none" stroke="#3f7130" strokeWidth="2.2" opacity="0.5" />

      {VEINS.map((index) => {
        const y = 34 + index * 19;
        const spread = 38 - Math.abs(y - 88) * 0.22;
        return (
          <g key={index} fill="none" stroke="#3f7130" strokeWidth="1.2" opacity="0.35">
            <path d={`M80 ${y}q ${-spread * 0.55} 6 ${-spread} 17`} />
            <path d={`M80 ${y}q ${spread * 0.55} 6 ${spread} 17`} />
          </g>
        );
      })}

      {SPOTS[variant].map(([cx, cy, rx, ry, rotate], index) => (
        <g key={index} transform={`rotate(${rotate} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={rx + 2} ry={ry + 2} fill="#c9b48b" opacity="0.55" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#8a5a2b" />
          <ellipse cx={cx - rx * 0.2} cy={cy - ry * 0.2} rx={rx * 0.45} ry={ry * 0.45} fill="#b08850" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}
