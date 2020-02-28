import {
    TChristmastideEndings,
    TCountryTypes,
    TCalendarTypes,
    isNil,
    isObject,
    TRomcalQuery,
    isRomcalConfig,
    TLocaleTypes,
} from "../utils/type-guards";
import dayjs from "dayjs";

/**
 * The configuration object that is passed either to the [[Calendar.calendarFor]]
 * or the [[Calendar.queryFor]] methods to retrieve an array of [[DateItems]].
 */
export interface IRomcalConfig {
    /**
     * The calendar year to obtain.
     */
    readonly year?: number;
    /**
     * The country
     */
    readonly country?: TCountryTypes;
    /**
     * The locale to be used for localizing
     */
    readonly locale?: TLocaleTypes;
    /**
     * The mode to calculate the end of Christmastide
     */
    readonly christmastideEnds?: TChristmastideEndings;
    /**
     * If true, Epiphany will be fixed to Jan 6 (defaults to false)
     */
    readonly epiphanyOnJan6?: boolean;
    /**
     * If false, excludes the season of epiphany from being included in the season of Christmas
     */
    readonly christmastideIncludesTheSeasonOfEpiphany?: boolean;
    /**
     *  If true, Corpus Christi is set to Thursday) (defaults to false)
     */
    readonly corpusChristiOnThursday?: boolean;
    /**
     * If true, Ascension is moved to the 7th Sunday of Easter) (defaults to false)
     */
    readonly ascensionOnSunday?: boolean;
    /**
     * The calendar type to query for.
     *
     * The type can be specified either as:
     * 1. `calendar`: Civil year (January 1 to December 31); or
     * 2. `liturgical`: Religious calendar year (1st Sunday of Advent of the preceeding year to the Saturday before the 1st Sunday of Advent in the current year).
     */
    readonly type?: TCalendarTypes;
    /**
     * A query object to get specific data from the calendar
     */
    readonly query?: TRomcalQuery;
}

export type IRomcalDefaultConfig = Required<Omit<IRomcalConfig, "country" | "locale" | "query" | "year" | "type">>;

/**
 * A modified variant of IRomcalConfig specifically for the [[Config]] class constructor
 * where all properties except query are **required**.
 */
export type TConfigConstructorType = { query?: TRomcalQuery } & Required<Omit<IRomcalConfig, "query">>;

/**
 * The [[Config]] class encapsulates all options that can be sent to this library to adjust date output.
 */
export default class Config {
    private _year: number;
    private _country: TCountryTypes;
    private _locale: TLocaleTypes;
    private _christmastideEnds: TChristmastideEndings;
    private _epiphanyOnJan6: boolean;
    private _christmastideIncludesTheSeasonOfEpiphany: boolean;
    private _corpusChristiOnThursday: boolean;
    private _ascensionOnSunday: boolean;
    private _type: TCalendarTypes;
    private _query?: TRomcalQuery;

    /**
     * Constructs a new [[Config]] object
     * @param config [[IRomcalConfig]] object representing all settings
     */
    constructor({
        year,
        country,
        locale,
        christmastideEnds,
        epiphanyOnJan6,
        christmastideIncludesTheSeasonOfEpiphany,
        corpusChristiOnThursday,
        ascensionOnSunday,
        type,
        query,
    }: TConfigConstructorType) {
        this._year = year;
        this._country = country;
        this._locale = locale;
        this._christmastideEnds = christmastideEnds;
        this._epiphanyOnJan6 = epiphanyOnJan6;
        this._christmastideIncludesTheSeasonOfEpiphany = christmastideIncludesTheSeasonOfEpiphany;
        this._corpusChristiOnThursday = corpusChristiOnThursday;
        this._ascensionOnSunday = ascensionOnSunday;
        this._type = type;
        this._query = query;
    }

    get year(): number {
        return this._year;
    }

    get country(): TCountryTypes {
        return this._country;
    }

    get locale(): TLocaleTypes {
        return this._locale;
    }

    get christmastideEnds(): TChristmastideEndings {
        return this._christmastideEnds;
    }

    get epiphanyOnJan6(): boolean {
        return this._epiphanyOnJan6;
    }

    get christmastideIncludesTheSeasonOfEpiphany(): boolean {
        return this._christmastideIncludesTheSeasonOfEpiphany;
    }

    get corpusChristiOnThursday(): boolean {
        return this._corpusChristiOnThursday;
    }

    get ascensionOnSunday(): boolean {
        return this._ascensionOnSunday;
    }

    get type(): TCalendarTypes {
        return this._type;
    }

    get query(): TRomcalQuery | undefined {
        return this._query;
    }

    /**
     * Get default configurations for the specified country from its calendar file.
     * If the country doesn't exist, return an empty object.
     * If the country is not specified, return the configuration for the general calendar.
     * @param country The country to obtain default configurations from
     */
    static async getConfig(country: TCountryTypes = "general"): Promise<IRomcalDefaultConfig> {
        const { defaultConfig: countrySpecificDefaultConfig } = await import(
            /* webpackExclude: /index\.ts/ */
            /* webpackChunkName: "calendars-sources/[request]" */
            /* webpackMode: "lazy" */
            `../calendars/${country}`
        );
        if (!isNil(countrySpecificDefaultConfig) && Object.keys(countrySpecificDefaultConfig).length > 0) {
            return countrySpecificDefaultConfig;
        } else {
            const { defaultConfig: generalCalendarConfig } = await import(
                /* webpackExclude: /index\.ts/ */
                /* webpackChunkName: "calendars-sources/[request]" */
                /* webpackMode: "lazy" */
                "../calendars/general"
            );
            return generalCalendarConfig;
        }
    }

    /**
     * Resolves the full configuration
     * @param maybeConfig An optional object that may be a usable instance of [[IRomcalConfig]]
     */
    static async resolveConfig(maybeConfig?: unknown): Promise<TConfigConstructorType> {
        // Get the default config
        let config: IRomcalConfig = await Config.getConfig("general");
        // Check if the user supplied their own configuration
        if (!isNil(maybeConfig)) {
            // Check if the user configuration is valid
            if (!isRomcalConfig(maybeConfig)) {
                console.warn("Will discard entire user supplied config object and use default configuration");
            } else {
                // A two step override where the base object of default configurations
                // will first be overriden by country specific if it isn't empty
                // and finally by a valid user defined configuration object
                config = {
                    // Base default config (general)
                    ...config,
                    // Specific country config (if the user supplied a country other than "general")
                    ...(maybeConfig.country !== "general" && (await Config.getConfig(maybeConfig.country))),
                    // User supplied config (will overwrite same keys before it)
                    ...maybeConfig,
                };
            }
        } else {
            console.debug("Will use default configuration to generate the calendar.");
        }

        // Sanitize and set defaults for missing configurations
        return {
            year: config.year ?? dayjs.utc().year(), // Use current year if not supplied by user
            country: config.country ?? "general", // Use general as country if none supplied by user
            locale: config.locale ?? "en", // Use english for localization if no lanaguage supplied]
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            christmastideEnds: config.christmastideEnds!, // Will use default if not defined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            epiphanyOnJan6: config.epiphanyOnJan6!, // Will use default if not defined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            christmastideIncludesTheSeasonOfEpiphany: config.christmastideIncludesTheSeasonOfEpiphany!, // Will use default if not defined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            corpusChristiOnThursday: config.corpusChristiOnThursday!, // Will use default if not defined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ascensionOnSunday: config.ascensionOnSunday!, // Will use default if not defineds
            type: config.type ?? "calendar", // Use value "calendar" if type not specified by user
            ...(isObject(config.query) && { query: config.query }), // Attach query if there's one
        } as TConfigConstructorType;
    }
}
