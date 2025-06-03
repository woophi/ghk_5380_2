import { BottomSheet } from '@alfalab/core-components/bottom-sheet';
import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Collapse } from '@alfalab/core-components/collapse';
import { Gap } from '@alfalab/core-components/gap';
import { Grid } from '@alfalab/core-components/grid';
import { PureCell } from '@alfalab/core-components/pure-cell';
import { SelectMobile } from '@alfalab/core-components/select/mobile';
import { Table } from '@alfalab/core-components/table';
import { Typography } from '@alfalab/core-components/typography';
import { CategoryDocumentMIcon } from '@alfalab/icons-glyph/CategoryDocumentMIcon';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { ChevronUpMIcon } from '@alfalab/icons-glyph/ChevronUpMIcon';
import { useEffect, useState } from 'react';
import hb from './assets/hb.jpg';
import img1 from './assets/img1.png';
import img2 from './assets/img2.png';
import img3 from './assets/img3.png';
import img4 from './assets/img4.png';
import img5 from './assets/img5.png';
import smile from './assets/smile.png';
import { LS, LSKeys } from './ls';
import { MoreInfo } from './MoreInfo';
import { appSt } from './style.css';
import { ThxLayout } from './thx/ThxLayout';
import { sendDataToGA } from './utils/events';
import { round } from './utils/round';

const faqs = [
  {
    question: 'Из чего складывается комиссия?',
    answer:
      'Комиссия складывается из вознаграждения за сделки (брокерская комиссия) и вознаграждение за расчеты с биржей (биржевая комиссия)',
  },
  {
    question: 'Что будет, если не выполняются условия для получения скидки?',
    answer:
      'Комиссия списывается в рублях со счета, на который подключен Альфа Трейдинг и по которому совершались соответствующие торговые операции',
  },
  {
    question: 'Как происходит списание комиссии?',
    answer:
      'Комиссия за сделки на фондовом рынке списывается при заключении сделки (при выполнении торгового поручения), а комиссия за сделки ФОРТС списывается во время расчетов по рынку ФОРТС (в платежах)',
  },
  {
    question: 'Как подключить тарифный план?',
    answer:
      'Чтобы подключить Альфа Трейдинг необходимо подключить продукт через специальный баннер, доступный на главной странице или, если баннера нет – в меню “Тарифы” раздела “Управление счетами” в мобильном приложении.',
  },
  {
    question: 'Как изменить тарифный план?',
    answer: (
      <>
        Доступные в тарифе скидки активируются и применяются на весь месяц, следующий за отчетным. В этом месяце вы работаете
        на скидку- в следующем скидка работает на вас.
        <br />
        <br />
        Если в этом месяце вы внесли 1 млн на счет, и совершили оборот 5х от среднемесячного объема ваших средств на счете,
        то на следующий месяц ваша ставка комиссии за сделки на фондовом рынке составит 0,0415% + 0,02% за урегулирование
        сделок, а ставка за сделки на рынке ФОРТС 1,65 р. за контракт.
        <br />
        <br />
        Скидки влияют только на комиссии по сделкам на фондовом рынке и рынке ФОРТС.
      </>
    ),
  },
];

const rows = [
  {
    title: 'Бесплатное обслуживание',
    subtitle: 'не зависимо от объёма сделок',
    img: img1,
  },
  {
    title: 'от 0,009%',
    subtitle: 'За сделки на фондовым рынке ',
    img: img2,
  },
  {
    title: 'от 9 копеек',
    subtitle: 'За контракт на срочном рынке',
    img: img3,
  },
  {
    title: 'Бонусы за перевод активов в Альфа-Инвестиции',
    subtitle: 'до 2,5% годовых',
    img: img4,
  },
  {
    title: 'Кэшбэк комиссий',
    subtitle: 'С торгового оборота до 150 000 в год',
    img: img5,
  },
];

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

const tableData = [
  {
    params: 'Обслуживание',
    trade: 'Платное',
    alfaTrade: 'Бесплатное',
  },
  {
    params: 'Ставка *ФР',
    trade: 'От 0,014%',
    alfaTrade: 'От 0,009%',
  },
  {
    params: 'Ставка *СР',
    trade: '2 ₽',
    alfaTrade: 'От 9 коп.',
  },
  {
    params: 'Скидки за оборот',
    trade: 'Есть',
    alfaTrade: 'Есть',
  },
  {
    params: 'Скидки за объем средств',
    trade: 'Нет',
    alfaTrade: 'Есть',
  },
  {
    params: 'Скидки за регулярную торговлю',
    trade: 'Нет',
    alfaTrade: 'Есть',
  },
  {
    params: 'Скидки действуют',
    trade: '1 день',
    alfaTrade: '1 месяц',
  },
];

const FOND_TRADE_CONDITION_1 = 0.049;
const FOND_TRADE_CONDITION_2 = 0.02;

const SDUI_LINK =
  'alfabank://sdui_screen?screenName=InvestmentLongread&fromCurrent=true&endpoint=v1/invest-main-screen-view/investment-longread/55889%3flocation=AM%26campaignCode=gh5380_var2';

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [openBs, setOpenBs] = useState(false);
  const [openMInfo, setOpenMInfo] = useState(false);
  const [aumOption, setAumOption] = useState(AUM_OPTIONS[1].key);
  const [tradeDurationOption, setTradeDurationOption] = useState(TRADE_DURATION_OPTIONS[1].key);
  const [tradeActivityOption, setTradeActivityOption] = useState(TRADE_ACTIVITY_OPTIONS[1].key);
  const [tradeVolumeOption, setTradeVolumeOption] = useState(TRADE_VOLUME_OPTIONS[1].key);
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [collapsedItems, setCollapsedItem] = useState<string[]>([]);

  const aumValueFM = AUM_OPTIONS.find(option => option.key === aumOption)?.valueFM || 0;
  const aumValueSM = AUM_OPTIONS.find(option => option.key === aumOption)?.valueSM || 0;

  const tradeDurationValueFM = TRADE_DURATION_OPTIONS.find(option => option.key === tradeDurationOption)?.valueFM || 0;
  const tradeDurationValueSM = TRADE_DURATION_OPTIONS.find(option => option.key === tradeDurationOption)?.valueSM || 0;

  const tradeActivityValue = TRADE_ACTIVITY_OPTIONS.find(option => option.key === tradeActivityOption)?.valueFM || 0;
  const tradeVolumeValue = TRADE_VOLUME_OPTIONS.find(option => option.key === tradeVolumeOption)?.valueSM || 0;

  const TOTAL_FOND_TRADE =
    FOND_TRADE_CONDITION_1 - aumValueFM - tradeDurationValueFM - tradeActivityValue + FOND_TRADE_CONDITION_2;
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
      window.location.replace(SDUI_LINK);
      setThx(true);
      setLoading(false);
    });
  };

  const closeTable = () => {
    setOpenBs(false);
  };
  const closeMoreInfo = () => {
    setOpenBs(false);
  };

  if (thxShow) {
    return <ThxLayout />;
  }

  return (
    <>
      <img src={hb} width="100%" height={280} className={appSt.img} />
      <div className={appSt.container}>
        <div>
          <Typography.Text view="component-primary" color="positive">
            Новый тариф
          </Typography.Text>
          <Typography.TitleResponsive tag="h1" view="large" font="system" weight="semibold">
            Альфа-Трейдинг
          </Typography.TitleResponsive>
        </div>
        <Typography.Text view="primary-medium">Самый выгодный тариф для трейдинга среди тарифов Альфы</Typography.Text>

        <PureCell className={appSt.boxGr}>
          <PureCell.Graphics verticalAlign="center">
            <img src={smile} width={40} height={40} alt="smile" />
          </PureCell.Graphics>
          <PureCell.Content>
            <PureCell.Main>
              <Typography.Text view="primary-medium">
                После подключения вам будет доступен месячный промо период с максимальными скидками
              </Typography.Text>
            </PureCell.Main>
          </PureCell.Content>
        </PureCell>
        <Typography.TitleResponsive tag="h4" view="small" font="system" weight="semibold">
          Преимущества
        </Typography.TitleResponsive>

        {rows.map((row, index) => (
          <PureCell key={index}>
            <PureCell.Graphics verticalAlign="center">
              <img src={row.img} width={48} height={48} alt={`img${index + 1}`} />
            </PureCell.Graphics>
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="component-primary" tag="p" defaultMargins={false}>
                  {row.title}
                </Typography.Text>
                <Typography.Text view="component-secondary" color="secondary">
                  {row.subtitle}
                </Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
          </PureCell>
        ))}
      </div>
      <div className={appSt.container} style={{ backgroundColor: '#F2F3F5' }}>
        <Typography.TitleResponsive tag="h4" view="small" font="system" weight="semibold">
          Рассчитать выгоду
        </Typography.TitleResponsive>
        <Typography.Text view="primary-medium">
          Скидки увеличиваються за счет выполнения определенных условий
        </Typography.Text>

        <div className={appSt.rows}>
          <SelectMobile
            options={AUM_OPTIONS}
            block={true}
            selected={aumOption}
            size={48}
            label="Объём портфеля"
            labelView="outer"
            onChange={({ selected }) => {
              window.gtag('event', '5380_calc1_var2');
              setAumOption(selected?.key || AUM_OPTIONS[0].key);
            }}
          />
          <SelectMobile
            options={TRADE_DURATION_OPTIONS}
            block={true}
            selected={tradeDurationOption}
            size={48}
            label="Продолжительность торговли"
            labelView="outer"
            onChange={({ selected }) => {
              window.gtag('event', '5380_calc2_var2');

              setTradeDurationOption(selected?.key || TRADE_DURATION_OPTIONS[0].key);
            }}
          />
          <SelectMobile
            options={TRADE_ACTIVITY_OPTIONS}
            block={true}
            selected={tradeActivityOption}
            size={48}
            label="Во сколько раз объём сделок больше объёма портфеля"
            labelView="outer"
            onChange={({ selected }) => {
              window.gtag('event', '5380_calc3_var2');

              setTradeActivityOption(selected?.key || TRADE_ACTIVITY_OPTIONS[0].key);
            }}
          />
          <SelectMobile
            options={TRADE_VOLUME_OPTIONS}
            block={true}
            selected={tradeVolumeOption}
            size={48}
            label="Количество закрытых контрактов на срочном рынке"
            labelView="outer"
            onChange={({ selected }) => {
              window.gtag('event', '5380_calc4_var2');

              setTradeVolumeOption(selected?.key || TRADE_VOLUME_OPTIONS[0].key);
            }}
          />
          <div className={appSt.boxWhite}>
            <Typography.Text view="component-secondary" tag="p" defaultMargins={false}>
              Фиксируется на следующий месяц после выполнения условий
            </Typography.Text>

            <Typography.TitleResponsive tag="h4" view="small" font="system" weight="semibold">
              Размер комиссии
            </Typography.TitleResponsive>
            <Gap size={12} />

            <Grid.Row>
              <Grid.Col width="6">
                <Typography.Text view="component-primary" color="secondary" tag="p" defaultMargins={false}>
                  <s>0,049%</s>
                </Typography.Text>
                <Typography.TitleResponsive tag="h5" view="xsmall" font="system" weight="semibold">
                  {round(TOTAL_FOND_TRADE, 4).toLocaleString('ru')}%
                </Typography.TitleResponsive>
                <Typography.Text view="primary-small" tag="p" defaultMargins={false}>
                  Фондовый рынок
                </Typography.Text>
              </Grid.Col>
              <Grid.Col width="6">
                <Typography.Text view="component-primary" color="secondary" tag="p" defaultMargins={false}>
                  <s>2 ₽</s>
                </Typography.Text>
                <Typography.TitleResponsive tag="h5" view="xsmall" font="system" weight="semibold">
                  {round(TOTAL_S_TRADE, 2).toLocaleString('ru')} ₽ за контракт
                </Typography.TitleResponsive>
                <Typography.Text view="primary-small" tag="p" defaultMargins={false}>
                  Срочный рынок
                </Typography.Text>
              </Grid.Col>
            </Grid.Row>
            <Gap size={16} />

            <ButtonMobile
              block
              view="secondary"
              size={40}
              onClick={() => {
                window.gtag('event', '5380_sr_var2');
                setOpenBs(true);
              }}
            >
              Сравнить тарифы по комиссиям
            </ButtonMobile>
          </div>
        </div>
      </div>
      <div className={appSt.container}>
        <Typography.TitleResponsive tag="h3" view="small" font="system" weight="medium">
          Частые вопросы
        </Typography.TitleResponsive>
        {faqs.map((faq, index) => (
          <div style={{ marginTop: '1rem' }} key={index}>
            <div
              onClick={() => {
                window.gtag('event', `5380_FAQ${index + 1}_var2`);

                setCollapsedItem(items =>
                  items.includes(String(index + 1))
                    ? items.filter(item => item !== String(index + 1))
                    : [...items, String(index + 1)],
                );
              }}
              className={appSt.row}
            >
              <Typography.Text view="primary-medium" weight="medium">
                {faq.question}
              </Typography.Text>
              {collapsedItems.includes(String(index + 1)) ? (
                <div style={{ flexShrink: 0 }}>
                  <ChevronUpMIcon color="#898991" />
                </div>
              ) : (
                <div style={{ flexShrink: 0 }}>
                  <ChevronDownMIcon color="#898991" />
                </div>
              )}
            </div>
            <Collapse expanded={collapsedItems.includes(String(index + 1))}>
              <Typography.Text view="primary-medium">{faq.answer}</Typography.Text>
            </Collapse>
          </div>
        ))}

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

        <Typography.Text view="primary-small">
          Подключение тарифа доступно на счета, на которых нет подключённых сервисов
        </Typography.Text>
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <ButtonMobile loading={loading} block view="primary" onClick={submit}>
          Подключить бесплатно
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
            Сравнение тарифов
          </Typography.Title>
        }
        open={openBs}
        onClose={closeTable}
        titleAlign="left"
        stickyHeader
        hasCloser
        contentClassName={appSt.btmContent}
      >
        <Table>
          <Table.THead>
            <Table.THeadCell title="Параметры">Параметры</Table.THeadCell>

            <Table.THeadCell title="Трейдер">Трейдер</Table.THeadCell>

            <Table.THeadCell title="Альфа Трейдинг" textAlign="right">
              Альфа Трейдинг
            </Table.THeadCell>
          </Table.THead>
          <Table.TBody>
            {tableData.map(row => (
              <Table.TRow key={row.params}>
                <Table.TCell>
                  <Typography.Text view="primary-small" tag="div">
                    {row.params}
                  </Typography.Text>
                </Table.TCell>

                <Table.TCell>
                  <Typography.Text view="primary-small" tag="div">
                    {row.trade}
                  </Typography.Text>
                </Table.TCell>
                <Table.TCell>
                  <Typography.Text view="primary-small" tag="div">
                    {row.alfaTrade}
                  </Typography.Text>
                </Table.TCell>
              </Table.TRow>
            ))}
          </Table.TBody>
        </Table>
        <div className={appSt.container}>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            *ФР - Фондовый рынок, *СР - Срочный рынок
          </Typography.Text>
        </div>
      </BottomSheet>
    </>
  );
};
