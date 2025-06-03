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
  padding: '12px 1rem',
  borderRadius: '1rem',
  backgroundColor: '#F2F3F5',
});

const img = style({ objectFit: 'cover' });
export const btmContent = style({
  padding: 0,
});
const rowBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: '.5rem',
  justifyContent: 'center',
});

const tags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
export const appSt = {
  bottomBtn,
  container,
  boxGr,
  img,
  btmContent,
  rowBtn,
  tags,
  row,
};
