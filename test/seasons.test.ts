/*
    The MIT License (MIT)

    Copyright (c) 2014 Pereira, Julian Matthew

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

import _ from "lodash";
import moment from "moment";

import { LiturgicalColors, Seasons, Calendar, Dates } from "../src";

describe("Testing date range functions", () => {
    describe("The Season of Advent", () => {
        it("There are always 4 Sundays in advent", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                expect(Dates.sundaysOfAdvent(i).length).toEqual(4);
            }
        });

        it("Depending on the day of Christmas, the 1st Sunday of Advent will be between Nov 27 - Dec 3", () => {
            expect(Dates.sundaysOfAdvent(2005)[0].date()).toEqual(27);
            expect(Dates.sundaysOfAdvent(2000)[0].date()).toEqual(3);
            expect(Dates.sundaysOfAdvent(2001)[0].date()).toEqual(2);
            expect(Dates.sundaysOfAdvent(2002)[0].date()).toEqual(1);
            expect(Dates.sundaysOfAdvent(2003)[0].date()).toEqual(30);
            expect(Dates.sundaysOfAdvent(1998)[0].date()).toEqual(29);
            expect(Dates.sundaysOfAdvent(1999)[0].date()).toEqual(28);
        });

        it("Depending on the day of Christmas, the number of days in Advent varies", () => {
            if (_.isEqual(Dates.christmas(2005).day(), 0)) {
                expect(Dates.daysOfAdvent(2005).length).toEqual(28);
            }
            if (_.isEqual(Dates.christmas(2000).day(), 1)) {
                expect(Dates.daysOfAdvent(2000).length).toEqual(22);
            }
            if (_.isEqual(Dates.christmas(2001).day(), 2)) {
                expect(Dates.daysOfAdvent(2001).length).toEqual(23);
            }
            if (_.isEqual(Dates.christmas(2002).day(), 3)) {
                expect(Dates.daysOfAdvent(2002).length).toEqual(24);
            }
            if (_.isEqual(Dates.christmas(2003).day(), 4)) {
                expect(Dates.daysOfAdvent(2003).length).toEqual(25);
            }
            if (_.isEqual(Dates.christmas(1998).day(), 5)) {
                expect(Dates.daysOfAdvent(1998).length).toEqual(26);
            }
            if (_.isEqual(Dates.christmas(1999).day(), 6)) {
                expect(Dates.daysOfAdvent(1999).length).toEqual(27);
            }
        });
    });

    describe("The Season of Lent in the Liturgical Calendar", () => {
        it("It is typically 6 weeks long", () => {
            for (let i = 1900, il = 2200; i <= il; i++) {
                expect(Dates.sundaysOfLent(i).length).toEqual(6);
            }
        });

        it("The first Sunday of Lent should be 4 days after Ash Wednesday", () => {
            for (let i = 1900, il = 2200; i <= il; i++) {
                expect(
                    _.head(Dates.sundaysOfLent(i))
                        .subtract(4, "days")
                        .isSame(Dates.ashWednesday(i)),
                ).toEqual(true);
            }
        });

        it("The last Sunday of Lent should be Palm Sunday", () => {
            for (let i = 1900, il = 2200; i <= il; i++) {
                const [, lastSundayOfLent] = Dates.sundaysOfLent(i);
                expect(lastSundayOfLent.isSame(Dates.palmSunday(i))).toEqual(true);
            }
        });

        it("The Saturday in the week after Ash Wednesday should be in the 1st week of Lent", () => {
            expect(Seasons.lent(2017)[10].key.toLowerCase()).toEqual("saturdayofthe1stweekoflent");
        });

        it("The 2nd Sunday of Lent should be in the 2nd week of Lent", () => {
            expect(Seasons.lent(2017)[11].key.toLowerCase()).toEqual("2ndsundayoflent");
        });
    });

    describe("The Octave of Easter", () => {
        it("Should be 8 days long", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                expect(Dates.octaveOfEaster(i).length).toEqual(8);
            }
        });

        it("The first day of the octave should be on Easter Sunday", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                expect(_.head(Dates.octaveOfEaster(i)).isSame(Dates.easter(i))).toEqual(true);
            }
        });

        it("The last day of the octave should be on Divine Mercy Sunday", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                const [, lastDayInTheOctaveOfEaster] = Dates.octaveOfEaster(i);
                expect(lastDayInTheOctaveOfEaster.isSame(Dates.divineMercySunday(i))).toEqual(true);
            }
        });
    });

    describe("Eastertide", () => {
        it("Should be 50 days long", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                expect(Dates.daysOfEaster(i).length).toEqual(50);
            }
        });

        it("The first Sunday of Easter should start on Easter Sunday", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                const [firstSundayOfEaster] = Dates.sundaysOfEaster(i);
                expect(firstSundayOfEaster.isSame(Dates.easter(i))).toEqual(true);
            }
        });

        it("The last Sunday of Easter should be on Pentecost Sunday", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                const [, lastSundayOfEaster] = Dates.sundaysOfEaster(i);
                expect(lastSundayOfEaster.isSame(Dates.pentecostSunday(i))).toEqual(true);
            }
        });
    });

    describe("Ordinary Time in the Liturgical Calendar", () => {
        it("If the end of Christmastide is on Epiphany, Ordinary time starts the next day", () => {
            for (let i = 1900, il = 2200; i <= il; i++) {
                const [firstDayInEarlyOrdinaryTime, , lastDayInEarlyOrdinaryTime] = Dates.daysOfEarlyOrdinaryTime(i, "t");
                expect(firstDayInEarlyOrdinaryTime.subtract(1, "days").isSame(Dates.epiphany(i))).toEqual(true);
                expect(lastDayInEarlyOrdinaryTime.add(1, "days").isSame(Dates.ashWednesday(i))).toEqual(true);
            }
        });

        it("If the end of Christmastide is on Baptism of the Lord, Ordinary time starts the next day", () => {
            for (let i = 1900, il = 2200; i <= il; i++) {
                const [firstDayInEarlyOrdinaryTime, , lastDayInEarlyOrdinaryTime] = Dates.daysOfEarlyOrdinaryTime(i, "o");
                expect(firstDayInEarlyOrdinaryTime.subtract(1, "days").isSame(Dates.baptismOfTheLord(i))).toEqual(true);
                expect(lastDayInEarlyOrdinaryTime.add(1, "days").isSame(Dates.ashWednesday(i))).toEqual(true);
            }
        });

        it("If the end of Christmastide is on Presentation of the Lord, Ordinary time starts the next day", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                const [firstDayInEarlyOrdinaryTime, , lastDayInEarlyOrdinaryTime] = Dates.daysOfEarlyOrdinaryTime(i, "e");
                expect(firstDayInEarlyOrdinaryTime.subtract(1, "days").isSame(Dates.presentationOfTheLord(i))).toEqual(true);
                expect(lastDayInEarlyOrdinaryTime.add(1, "days").isSame(Dates.ashWednesday(i))).toEqual(true);
            }
        });

        it("There are typically 3 to 8 Sundays (and on rare occasions, 9 Sundays) in ordinary Time between the Baptism of the Lord to Ash Wednesday", () => {
            for (let i = 1900, il = 2200; i <= il; i++) {
                const dates = Dates.daysOfEarlyOrdinaryTime(i);
                const sundays = dates.filter(d => {
                    return d.day() === 0;
                });
                const [, lastDayOfOrdinaryTime] = dates;
                expect(sundays.length).toBeOneOf([3, 4, 5, 6, 7, 8, 9]);
                expect(lastDayOfOrdinaryTime.add(1, "days").isSame(Dates.ashWednesday(i))).toEqual(true);
            }
        });

        it("There are typically 24 to 29 Sundays in Ordinary Time between the Pentecost to the 1st Sunday of Advent", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                const dates = Dates.daysOfLaterOrdinaryTime(i);
                const sundays = dates.filter(d => d.day() === 0);
                const [firstDayInLaterOrdinaryTime, , lastDayInLaterOrdinaryTime] = dates;
                expect(sundays.length).toBeOneOf([23, 24, 25, 26, 27, 28, 29]);
                expect(firstDayInLaterOrdinaryTime.subtract(1, "days").isSame(Dates.pentecostSunday(i))).toEqual(true);
                expect(lastDayInLaterOrdinaryTime.add(1, "days").isSame(Dates.sundaysOfAdvent(i)[0])).toEqual(true);
            }
        });
    });

    describe("The Octave of Christmas", () => {
        it("Should be 8 days long from Christmas to the feast of the Holy Family", () => {
            for (let i = 1900, il = 2100; i <= il; i++) {
                expect(Dates.octaveOfChristmas(i).length).toEqual(8);
            }
        });
    });

    describe("Christmastide", () => {
        describe("If Epiphany is celebrated on Jan 6", () => {
            it("The last day of Christmas is on 6th Jan, if following the Traditional end of the Christmas season", () => {
                for (let i = 1900, il = 2100; i <= il; i++) {
                    const [, lastDayInChristmastide] = Dates.christmastide(i, "t", true);
                    expect(lastDayInChristmastide.isSame(moment.utc({ year: i + 1, month: 0, day: 6 }))).toEqual(true);
                }
            });

            it("The last day of Christmas is always on Sunday on the feast of the Baptism of the Lord, if following the Ordinary Liturgical Calendar of the Western Roman Rite", () => {
                for (let i = 1900, il = 2100; i <= il; i++) {
                    const [, lastDayInChristmastide] = Dates.christmastide(i, "o", true);
                    expect(lastDayInChristmastide.day()).toEqual(0);
                }
            });
        });

        describe("If Epiphany is not celebrated on Jan 6 (i.e. on a Sunday)", () => {
            it("If following the Traditional end of the Christmas season, the last day of Christmas is on Epiphany", () => {
                for (let i = 1900, il = 2100; i <= il; i++) {
                    const [, lastDayInChristmastide] = Dates.christmastide(i, "t");
                    expect(lastDayInChristmastide.isSame(Dates.epiphany(i + 1))).toEqual(true);
                }
            });

            it("If following the Ordinary Liturgical Calendar of the Western Roman Rite, the last day of Christmas is the feast of the Baptism of the Lord", () => {
                for (let i = 1900, il = 2100; i <= il; i++) {
                    const [, lastDayInChristmastide] = Dates.christmastide(i, "o");
                    expect(lastDayInChristmastide.isSame(Dates.baptismOfTheLord(i + 1))).toEqual(true);
                }
            });

            it("If following the Extraordinary Liturgical Calendar of the Western Roman Rite, the last day of Christmas is on the Feast of the Presentation", () => {
                for (let i = 1900, il = 2100; i <= il; i++) {
                    const [, lastDayInChristmastide] = Dates.christmastide(i, "e");
                    expect(lastDayInChristmastide.isSame(Dates.presentationOfTheLord(i + 1))).toEqual(true);
                }
            });

            it("If no rule is specified, the last day of Christmas will default to the Feast of the Baptism", () => {
                for (let i = 1900, il = 2100; i <= il; i++) {
                    const [, lastDayInChristmastide] = Dates.christmastide(i);
                    expect(lastDayInChristmastide.isSame(Dates.baptismOfTheLord(i + 1))).toEqual(true);
                }
            });
        });
    });
});

describe("Testing seasons utility functions", () => {
    this.timeout(0);

    describe("The liturgical year is divided to a number of seasons", () => {
        const calendar = Calendar.calendarFor({
            query: {
                group: "liturgicalSeasons",
            },
        });

        it("Groups dates within seasons based on identifiers", () => {
            calendar.forEach((dates, season) => {
                dates.each(date => expect(date.data.season.key).toEqual(season));
            });
        });

        it("The liturgical color for Ordinary Time is green", () => {
            Seasons.earlyOrdinaryTime(2015, "o", false).forEach(date => {
                expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.GREEN);
            });
            Seasons.laterOrdinaryTime(2015).forEach(date => {
                expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.GREEN);
            });
        });

        it("The liturgical color for Lent and Advent is purple, except for the 4th Sunday of Lent and 3rd Sunday of Advent, which is rose", () => {
            Seasons.lent(2015).forEach(date => {
                if (_.eq(date.key.toLowerCase(), "4thsundayoflent")) {
                    expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.ROSE);
                } else {
                    expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.PURPLE);
                }
            });
            Seasons.advent(2015).forEach(date => {
                if (_.eq(date.key.toLowerCase(), "3rdsundayofadvent")) {
                    expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.ROSE);
                } else {
                    expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.PURPLE);
                }
            });
        });

        it("The liturgical color for Christmastide and Eastertide is white", () => {
            Seasons.christmastide(2015, "o", false).forEach(date => {
                expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.WHITE);
            });
            Seasons.eastertide(2015).forEach(date => {
                expect(date.data.meta.liturgicalColor).toEqual(LiturgicalColors.WHITE);
            });
        });
    });
});
