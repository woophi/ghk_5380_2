import { style } from '@vanilla-extract/css';

const bottomBtn = style({
  position: 'fixed',
  zIndex: 2,
  width: '100%',
  padding: '12px',
  bottom: 0,
});

const container = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '1rem',
});

const boxGr = style({
  padding: '1rem',
  borderRadius: '1rem',
  backgroundColor: '#F2F3F5',
});
const boxWhite = style({
  padding: '1rem 1rem 20px',
  borderRadius: '1rem',
  backgroundColor: '#FFF',
});

const rows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const img = style({ objectFit: 'cover' });
export const btmContent = style({
  padding: 0,
});
export const appSt = {
  bottomBtn,
  container,
  boxGr,
  rows,
  img,
  boxWhite,
  row,
  btmContent,
};
