import { BottomSheet } from '@alfalab/core-components/bottom-sheet';
import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Gap } from '@alfalab/core-components/gap';
import { PureCell } from '@alfalab/core-components/pure-cell';
import { Tag } from '@alfalab/core-components/tag';
import { Typography } from '@alfalab/core-components/typography';
import { CalculatorMIcon } from '@alfalab/icons-glyph/CalculatorMIcon';
import { CategoryDocumentMIcon } from '@alfalab/icons-glyph/CategoryDocumentMIcon';
import { useEffect, useState } from 'react';
import hb from './assets/hb.jpg';
import { LS, LSKeys } from './ls';
import { MoreInfo } from './MoreInfo';
import { appSt } from './style.css';
import { sendDataToGA } from './utils/events';
import { round } from './utils/round';

const AUM_OPTIONS = [
  { key: '100000', content: 'Менее 200 тыс ₽ ', valueFM: 0, valueSM: 0 },
  { key: '200000', content: 'от 200 тыс ₽', valueFM: 0.002, valueSM: 0.05 },
  { key: '1000000', content: 'от 1 млн ₽', valueFM: 0.0025, valueSM: 0.15 },
  { key: '5000000', content: 'от 5 млн ₽', valueFM: 0.0035, valueSM: 0.25 },
  { key: '20000000', content: 'от 20 млн ₽', valueFM: 0.004, valueSM: 0.31 },
];
const TRADE_DURATION_OPTIONS = [
  { key: '2', content: 'Менее 3 мес', valueFM: 0, valueSM: 0 },
  { key: '3', content: 'от 3 мес.', valueFM: 0.003, valueSM: 0.15 },
  { key: '4', content: 'от 4 мес.', valueFM: 0.00875, valueSM: 0.3 },
  { key: '5', content: 'от 5 мес.', valueFM: 0.014, valueSM: 0.5 },
  { key: '6', content: 'от 6 мес.', valueFM: 0.016, valueSM: 0.65 },
];
const TRADE_ACTIVITY_OPTIONS = [
  { key: '4', content: 'Объем сделок менее x5', valueFM: 0 },
  { key: '5', content: 'Объём сделок x5', valueFM: 0.005 },
  { key: '10', content: 'Объём сделок x10', valueFM: 0.014 },
  { key: '20', content: 'Объём сделок x20', valueFM: 0.018 },
  { key: '50', content: 'Объём сделок x50', valueFM: 0.02 },
];
const TRADE_VOLUME_OPTIONS = [
  { key: '400', content: 'Менее 500 контрактов', valueSM: 0 },
  { key: '500', content: '500 контрактов', valueSM: 0.2 },
  { key: '2000', content: '2 000 контрактов', valueSM: 0.5 },
  { key: '5000', content: '5 000 контрактов', valueSM: 0.8 },
  { key: '20000', content: '20 000 контрактов', valueSM: 0.95 },
];

const FOND_TRADE_CONDITION_1 = 0.049;

const SDUI_LINK =
  'alfabank://sdui_screen?screenName=InvestmentLongread&fromCurrent=true&endpoint=v1/invest-main-screen-view/investment-longread/55890%3flocation=AM%26campaignCode=gh5380_var2';
if (LS.getItem(LSKeys.ShowThx, false)) {
  window.location.replace(SDUI_LINK);
}
export const App = () => {
  const [loading, setLoading] = useState(false);
  const [openBs, setOpenBs] = useState(false);
  const [openMInfo, setOpenMInfo] = useState(false);
  const [aumOption, setAumOption] = useState(AUM_OPTIONS[1].key);
  const [tradeDurationOption, setTradeDurationOption] = useState(TRADE_DURATION_OPTIONS[1].key);
  const [tradeActivityOption, setTradeActivityOption] = useState(TRADE_ACTIVITY_OPTIONS[1].key);
  const [tradeVolumeOption, setTradeVolumeOption] = useState(TRADE_VOLUME_OPTIONS[1].key);

  const aumValueFM = AUM_OPTIONS.find(option => option.key === aumOption)?.valueFM || 0;
  const aumValueSM = AUM_OPTIONS.find(option => option.key === aumOption)?.valueSM || 0;

  const tradeDurationValueFM = TRADE_DURATION_OPTIONS.find(option => option.key === tradeDurationOption)?.valueFM || 0;
  const tradeDurationValueSM = TRADE_DURATION_OPTIONS.find(option => option.key === tradeDurationOption)?.valueSM || 0;

  const tradeActivityValue = TRADE_ACTIVITY_OPTIONS.find(option => option.key === tradeActivityOption)?.valueFM || 0;
  const tradeVolumeValue = TRADE_VOLUME_OPTIONS.find(option => option.key === tradeVolumeOption)?.valueSM || 0;

  const TOTAL_FOND_TRADE = FOND_TRADE_CONDITION_1 - aumValueFM - tradeDurationValueFM - tradeActivityValue;
  const TOTAL_S_TRADE = 2 - (aumValueSM + tradeDurationValueSM + tradeVolumeValue);

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const submit = () => {
    window.gtag('event', '5380_add_var2');
    setLoading(true);

    sendDataToGA({
      calc: JSON.stringify([aumOption, tradeDurationOption, tradeActivityOption, tradeVolumeOption]),
    }).then(() => {
      LS.setItem(LSKeys.ShowThx, true);
      window.location.replace(SDUI_LINK);
      setLoading(false);
    });
  };

  const closeTable = () => {
    setOpenBs(false);
  };
  const closeMoreInfo = () => {
    setOpenMInfo(false);
  };

  return (
    <>
      <img src={hb} width="100%" height={280} className={appSt.img} />
      <div className={appSt.container}>
        <div>
          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
            Альфа-Трейдинг
          </Typography.TitleResponsive>
        </div>
        <Typography.Text view="primary-medium">
          Выгодный тариф для трейдинга, накопительный кэшбэк и бонус за перевод активов
        </Typography.Text>

        <ButtonMobile
          block
          view="secondary"
          size={48}
          onClick={() => {
            window.gtag('event', '5380_calc_var2');
            setOpenBs(true);
          }}
        >
          <div className={appSt.rowBtn}>
            <CalculatorMIcon /> Рассчитать выгоду
          </div>
        </ButtonMobile>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Преимущества
        </Typography.TitleResponsive>

        <div>
          <Typography.Text view="component-primary" tag="p" defaultMargins={false}>
            Бонусы за перевод активов в Альфа-Инвестиции
          </Typography.Text>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            до 2,5% годовых
          </Typography.Text>
        </div>

        <div>
          <Typography.Text view="component-primary" tag="p" defaultMargins={false}>
            Кэшбэк комиссий
          </Typography.Text>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            С торгового оборота до 150 000 в год
          </Typography.Text>
        </div>

        <div>
          <Typography.Text view="component-primary" tag="p" defaultMargins={false}>
            Самые низкие комиссии
          </Typography.Text>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            За счёт активности на счёте
          </Typography.Text>
        </div>

        <div className={appSt.boxGr}>
          <Typography.Text view="component-primary" tag="p" defaultMargins={false}>
            от 0,009%
          </Typography.Text>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            За сделки на фондовым рынке
          </Typography.Text>
        </div>
        <div className={appSt.boxGr}>
          <Typography.Text view="component-primary" tag="p" defaultMargins={false}>
            от 9 копеек
          </Typography.Text>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            За контракт на срочном рынке
          </Typography.Text>
        </div>

        <Typography.Text view="primary-small" color="secondary">
          Это не полное описание тарифа. Узнать о нём подробнее вы можете по ссылке ниже
        </Typography.Text>

        <PureCell
          style={{ margin: '1rem 0' }}
          onClick={() => {
            window.gtag('event', '5380_moreinfo_var2');
            setOpenMInfo(true);
          }}
        >
          <PureCell.Graphics verticalAlign="center">
            <CategoryDocumentMIcon />
          </PureCell.Graphics>
          <PureCell.Content>
            <PureCell.Main>
              <Typography.Text view="primary-medium">Подробнее о тарифе</Typography.Text>
            </PureCell.Main>
          </PureCell.Content>
        </PureCell>

        <Typography.Text view="primary-small" color="secondary">
          Подключение тарифа доступно, на счета на которых нет подключенных сервисов
        </Typography.Text>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <ButtonMobile loading={loading} block view="primary" onClick={submit}>
          Подключить
        </ButtonMobile>
      </div>

      <BottomSheet
        open={openMInfo}
        onClose={closeMoreInfo}
        titleAlign="left"
        stickyHeader
        hasCloser
        contentClassName={appSt.btmContent}
      >
        <MoreInfo />
      </BottomSheet>

      <BottomSheet
        title={
          <Typography.Title tag="h4" view="small" font="system" weight="semibold">
            Рассчитать выгоду
          </Typography.Title>
        }
        open={openBs}
        onClose={closeTable}
        titleAlign="left"
        stickyHeader
        hasCloser
        contentClassName={appSt.btmContent}
      >
        <div className={appSt.container}>
          <div>
            <Typography.TitleResponsive tag="h3" view="xsmall" font="system" weight="semibold">
              Объём портфеля
            </Typography.TitleResponsive>
            <Typography.Text view="primary-small" color="secondary">
              Чем больше портфель, тем больше выгода
            </Typography.Text>
          </div>

          <div className={appSt.tags}>
            {AUM_OPTIONS.map(option => (
              <Tag
                checked={option.key === aumOption}
                size="xs"
                onClick={() => {
                  setAumOption(option.key);
                }}
                view="filled"
              >
                {option.content}
              </Tag>
            ))}
          </div>

          <div>
            <Typography.TitleResponsive tag="h3" view="xsmall" font="system" weight="semibold">
              Торговая активность
            </Typography.TitleResponsive>
            <Typography.Text view="primary-small" color="secondary">
              Период торговли должен быть непрерывным
            </Typography.Text>
          </div>

          <div className={appSt.tags}>
            {TRADE_DURATION_OPTIONS.map(option => (
              <Tag
                checked={option.key === tradeDurationOption}
                size="xs"
                onClick={() => {
                  setTradeDurationOption(option.key);
                }}
                view="filled"
              >
                {option.content}
              </Tag>
            ))}
          </div>

          <div>
            <Typography.TitleResponsive tag="h3" view="xsmall" font="system" weight="semibold">
              Время торговли
            </Typography.TitleResponsive>
            <Typography.Text view="primary-small" color="secondary">
              Чем выше торговая активность, тем больше выгода
            </Typography.Text>
          </div>

          <div className={appSt.tags}>
            {TRADE_ACTIVITY_OPTIONS.map(option => (
              <Tag
                checked={option.key === tradeActivityOption}
                size="xs"
                onClick={() => {
                  setTradeActivityOption(option.key);
                }}
                view="filled"
              >
                {option.content}
              </Tag>
            ))}
          </div>

          <div>
            <Typography.TitleResponsive tag="h3" view="xsmall" font="system" weight="semibold">
              Оборот
            </Typography.TitleResponsive>
            <Typography.Text view="primary-small" color="secondary">
              Чем выше торговый оборот, тем больше выгода
            </Typography.Text>
          </div>

          <div className={appSt.tags}>
            {TRADE_VOLUME_OPTIONS.map(option => (
              <Tag
                checked={option.key === tradeVolumeOption}
                size="xs"
                onClick={() => {
                  setTradeVolumeOption(option.key);
                }}
                view="filled"
              >
                {option.content}
              </Tag>
            ))}
          </div>

          <Typography.TitleResponsive tag="h3" view="xsmall" font="system" weight="semibold">
            Ожидаемая комиссия
          </Typography.TitleResponsive>

          <div className={appSt.row}>
            <Typography.Text view="primary-medium" color="secondary">
              Фондовый рынок
            </Typography.Text>
            <Typography.TitleResponsive tag="h2" view="small" font="system" weight="semibold">
              {round(TOTAL_FOND_TRADE, 4).toLocaleString('ru')}%
            </Typography.TitleResponsive>
          </div>
          <div className={appSt.row}>
            <Typography.Text view="primary-medium" color="secondary">
              Срочный рынок
            </Typography.Text>
            <Typography.TitleResponsive tag="h2" view="small" font="system" weight="semibold">
              {round(TOTAL_S_TRADE, 2).toLocaleString('ru')} ₽
            </Typography.TitleResponsive>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};
