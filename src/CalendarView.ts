import Calendar from './Calendar';
import { DayOfTheWeek, MonthOfTheYear } from './CalendarEnums';
import { ICalendarOptions, IHSLAColor } from './CalendarModels';

function darkenLighten(color: IHSLAColor, amt: number): string {
  return `hsla(${color.h}, ${color.s}%, ${color.l + amt}%, ${color.a})`;
}

const assets = {
  css: (options: ICalendarOptions): string => {
    return `
        .tiny-calendar-wrap {
            overflow: hidden;
            box-shadow: 8px 8px 7px rgba(0, 0, 0, 0.07);
            font-family: sans-serif;
            border-radius: 0.35em;
        }

        .tiny-calendar-wrap * {
            box-sizing: border-box;
        }

        .tiny-calendar-wrap header {
            height: auto;
        }

        .tiny-calendar-wrap .title {
            padding: 0.35em 0;
            background-color: ${darkenLighten(options.baseColor!, 0)};
            color: #eee;
            text-align: center;
        }

        .tiny-calendar-wrap .controls {
            display: flex;
        }

        .tiny-calendar-wrap .controls .action {
            display: flex;
            flex: 1 1 auto;
            background-color: ${darkenLighten(options.baseColor!, 0)};
        }

        .tiny-calendar-wrap .controls .action .btn {
            border: none;
            outline: none;
            background-color: ${darkenLighten(options.baseColor!, -20)};
            flex: 1 1 auto;
            padding: 0.5em;
            color: #eee;
            text-transform: uppercase;
            font-size: 100%;
            line-height: 1.15;
            margin: 0;
            cursor: pointer;
        }

        .tiny-calendar-wrap .controls .action .btn:hover {
            background-color: ${darkenLighten(options.baseColor!, -30)};
        }

        .tiny-calendar-wrap .day {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.25em;
            color: #555;
            border: 1px solid #ccc;
            cursor: pointer;
        }

        .tiny-calendar-wrap .day.on.today{
            background-color: #fff27d;
        }

        .tiny-calendar-wrap .day.on {
            background-color: #eee;
        }

        .tiny-calendar-wrap .day.on:hover {
            background-color: #fff;
        }

        .tiny-calendar-wrap .day.off {
            background-color: #dedede;
            color: #999;
        }

        .tiny-calendar-wrap .cal-table {
            width: 100%;
        }

        .tiny-calendar-wrap .cal-table .days {
            background-color: ${darkenLighten(options.baseColor!, -40)};
            text-align: center;
        }

        .tiny-calendar-wrap .cal-table .day-name {
            padding: 0.25em 0.75em;
            color: #bbb;
            text-transform: uppercase;
            border: 1px solid ${darkenLighten(options.baseColor!, -50)};
        }

        .tiny-calendar-wrap section.pick-months, .tiny-calendar-wrap section.pick-years {
            height: 0;
            overflow: hidden;
            transition: height 120ms;
        }

        .tiny-calendar-wrap section.pick-months.open, .tiny-calendar-wrap section.pick-years.open {
            height: calc(100% - 63px);
        }

        .tiny-calendar-wrap section.pick-months ul, .tiny-calendar-wrap section.pick-years ul {
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .tiny-calendar-wrap section.pick-months ul li, .tiny-calendar-wrap section.pick-years ul li {
            background-color: #dedede;
            padding: 0.25em;
            flex: 0 0 25%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            transition: background-color 250ms;
            cursor: pointer;
            border: 1px solid #ccc;
        }

        .tiny-calendar-wrap section.pick-months ul li:hover, .tiny-calendar-wrap section.pick-years ul li:hover {
            background-color: #fff;
        }
        `;
  },
  html: `
        <div class="tiny-calendar-wrap">
            <header>
                <div class="title">Tiny Calendar</div>
                <nav class="controls">
                    <div class="action">
                        <button class="btn btn-prev">&lt;</button>
                    </div>
                    <div class="action">
                        <button class="btn btn-month">September</button>
                    </div>
                    <div class="action">
                        <button class="btn btn-year">2020</button>
                    </div>
                    <div class="action">
                        <button class="btn btn-next">&gt;</button>
                    </div>
                </nav>
            </header>
            <section class="pick-months">
                <ul>
                    <template class="pick-month-template">
                        <li>
                            <div>Jan</div>
                        </li>
                    </template>
                </ul>
            </section>
            <section class="pick-years">
                <ul>
                    <template class="pick-year-template">
                        <li class="year">xxxx</li>
                    </template>
                </ul>
            </section>
            <section class="pick-days">
                <table class="cal-table" cellspacing="0" cellpadding="0">
                    <thead class="days">
                        <tr>
                            <template>
                                <td>
                                    <div class="day-name">xxxx</div>
                                </td>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <template class="pick-day-template">
                                <td>
                                    <div class="day">
                                        <div class="day-inner">xxxx</div>
                                    </div>
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    `,
};

export default class CalendarView {
  private el: HTMLElement;
  private container: HTMLElement;
  private calendar: Calendar;
  private styles: HTMLStyleElement;
  private btns: any;
  private templates: any;
  private sections: any;
  private selectableDays: any[] = [];

  constructor(el: HTMLElement, calendar: Calendar) {
    this.container = el;
    this.container.innerHTML = assets.html;
    this.el = this.container.querySelector<HTMLElement>('.tiny-calendar-wrap')!;
    this.calendar = calendar;
    // templates
    this.templates = {
      day: this.el.querySelector('template.pick-day-template'),
      month: this.el.querySelector('template.pick-month-template'),
      year: this.el.querySelector('template.pick-year-template'),
    };
    // styles
    this.styles = document.createElement('style');
    this.styles.type = 'text/css';
    this.styles.innerHTML = assets.css(this.calendar.options!);
    this.el.appendChild(this.styles);
    // buttons
    this.btns = {
      month: this.el.querySelector<HTMLButtonElement>('.btn-month'),
      next: this.el.querySelector<HTMLButtonElement>('.btn-next'),
      previous: this.el.querySelector<HTMLButtonElement>('.btn-prev'),
      year: this.el.querySelector<HTMLButtonElement>('.btn-year'),
    };
    // sections
    this.sections = {
      pickMonths: this.el.querySelector<HTMLElement>('section.pick-months'),
      pickYears: this.el.querySelector<HTMLElement>('section.pick-years'),
    };
    // events
    this.onClick = this.onClick.bind(this);
    this.el.addEventListener('click', this.onClick);
    // render
    this.render();
  }

  private onClick(e: MouseEvent) {
    const t: HTMLElement = e.target as HTMLTemplateElement;
    if (t.classList.contains('day-inner') || t.classList.contains('day')) {
      // if callback
      if (this.calendar.options.onDateSelected) {
        const day = this.selectableDays[Number(t.dataset[`selectableDayIndex`])];
        this.calendar.options.onDateSelected(day);
      }
    } else if (t.classList.contains('btn')) {
      if (t.classList.contains('btn-month')) {
        this.toggleSection(this.sections.pickMonths);
      } else if (t.classList.contains('btn-year')) {
        this.toggleSection(this.sections.pickYears);
      } else if (t.classList.contains('btn-prev')) {
        this.onClickPrevNext('prev');
      } else if (t.classList.contains('btn-next')) {
        this.onClickPrevNext('next');
      }
    } else if (t.classList.contains('year')) {
      this.changeYear(+t.innerText);
    } else if (t.classList.contains('month')) {
      this.changeMonth(+t.dataset[`monthIndex`]!);
    }
  }

  private changeMonth(month: MonthOfTheYear) {
    this.calendar.setMonth(month);
    this.toggleSection(this.sections.pickMonths);
    this.render();
  }

  private changeYear(year: number) {
    this.calendar.setYear(year);
    this.toggleSection(this.sections.pickYears);
    this.render();
  }

  private toggleSection(section: any) {
    this.el.querySelectorAll('.open').forEach(el => {
      if (el !== section) {
        el.classList.remove('open');
      }
    });
    section.classList.toggle('open');
  }

  private render() {
    // reset containers
    this.el.querySelector('.cal-table thead tr')!.innerHTML = '';
    this.el.querySelector('.cal-table tbody')!.innerHTML = '';
    this.sections.pickYears.querySelector('ul')!.innerHTML = '';
    this.sections.pickMonths.querySelector('ul')!.innerHTML = '';
    // day names
    for (let i = 0; i <= 6; i++) {
      const el = document.createElement('td');
      el.classList.add('day-name');
      el.innerHTML = `<div>${DayOfTheWeek[i].substr(0, 1)}</div>`;
      this.el.querySelector('table thead tr')!.appendChild(el);
    }
    // months
    const monthsTarget = this.sections.pickMonths.querySelector('ul');
    for (let i = 0; i < 12; i++) {
      const li = document.createElement('li');
      li.innerText = MonthOfTheYear[i].slice(0, 3);
      li.classList.add('month');
      li.setAttribute('data-month-index', `${i}`);
      monthsTarget.appendChild(li);
    }
    // years
    for (let i = this.calendar.year - 12; i < this.calendar.year + 12; i++) {
      const yearClone = document.importNode(this.templates.year.content, true);
      yearClone.querySelector('li').innerHTML = `${i}`;
      this.sections.pickYears.querySelector('ul').appendChild(yearClone);
    }
    // days
    this.selectableDays = [];
    const startsOn = this.calendar.currentMonth.dayOfTheWeekStartsOn;
    const currentMonthLength = this.calendar.currentMonth.days.length;
    const previousMonth = this.calendar.getPreviousMonth();
    const nextMonth = this.calendar.getNextMonth();
    const date = new Date();
    const todaysDate = new Date(`${MonthOfTheYear[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`);
    for (let row = 0, i = 0; row < 6; row++) {
      const rowEl = document.createElement('tr');
      for (let col = 0; col < 7; col++) {
        const day = this.calendar.currentMonth.days[i - startsOn];
        const prevDay = previousMonth.days[previousMonth.days.length - (startsOn - i)];
        const nextDay = nextMonth.days[-currentMonthLength + (i - startsOn)];
        const clone = document.importNode(this.templates.day.content, true);
        const dInner = clone.querySelector('.day-inner')!;
        const dayEl = clone.querySelector('.day')!;
        dayEl.classList.add(day ? 'on' : 'off');
        if (day && todaysDate.toString() === day.toDate().toString()) {
          dayEl.classList.add('today');
        }
        if (day) {
          dInner.innerHTML = `${day.number}`;
          this.selectableDays[i] = day;
        } else if (prevDay) {
          dInner.innerHTML = `${prevDay.number}`;
          this.selectableDays[i] = prevDay;
        } else if (nextDay) {
          dInner.innerHTML = `${nextDay.number}`;
          this.selectableDays[i] = nextDay;
        }
        dInner.setAttribute('data-selectable-day-index', `${i}`);
        rowEl.appendChild(clone);
        i++;
      }
      this.el.querySelector('table tbody')!.appendChild(rowEl);
    }
    // btns
    this.btns.month.innerHTML = `${this.calendar.currentMonth.name}`;
    this.btns.year.innerHTML = `${this.calendar.currentMonth.year}`;
    // set height of tiny calendar
    this.el.style.height = this.el.clientHeight + 'px';
  }

  private onClickPrevNext(dir: string) {
    if (dir === 'prev') {
      this.calendar.previousMonth();
      this.render();
    } else if (dir === 'next') {
      this.calendar.nextMonth();
      this.render();
    }
  }

  private onDestroy() {
    this.el.removeEventListener('click', this.onClick);
  }
}
