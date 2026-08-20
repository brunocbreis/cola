# The example portfolios

Each `##` heading below is one strategy, shown as a tab on the tree screen. The `>` line
under the heading is the caption printed beneath the tabs.

Depth is the number of leading dashes. A row with children needs no ticker, price, or
value — those add up from underneath. Kind says what a group does with its children's
targets: blank for separate targets, `shared` when the holdings are interchangeable
alternatives sharing one, `equal` when they split the group evenly. The children of a
shared or an equal group need no weight — the group decides it.

## By region

> One target per part of the world, to keep a neutral exposure or bet
> in specific geographies.

| Holding | Weight | Ticker | Price | Value | Kind |
|---|---|---|---|---|---|
| United States | 50 | | | | |
| - S&P 500 Core | 70 | | | | shared |
| -- Vanguard S&P 500 | | VOO | 505.10 | 2700 | |
| -- iShares Core S&P 500 | | IVV | 551.30 | 1800 | |
| - US Small Cap Value | 30 | AVUV | 97.60 | 1900 | |
| Developed ex-US | 20 | | | | |
| - Developed Markets | 50 | VEA | 51.80 | 900 | |
| - International Small Cap | 30 | VSS | 128.40 | 400 | |
| - Treasury Bonds | 20 | GOVT | 22.90 | 300 | |
| Europe | 20 | | | | |
| - Developed Europe | 65 | VGK | 68.30 | 1100 | |
| - Europe Small Cap | 35 | DFSE | 32.15 | 400 | |
| Emerging Markets | 10 | | | | shared |
| - Core MSCI Emerging | | IEMG | 55.40 | 300 | |
| - FTSE Emerging | | VWO | 46.20 | 200 | |

## By industry

> A stock picker's book, held to a shape. Conviction decides what goes in each sector;
> the targets decide how big it gets.

| Holding | Weight | Ticker | Price | Value | Kind |
|---|---|---|---|---|---|
| Technology | 35 | | | | |
| - Alphabet | 30 | | | | shared |
| -- Alphabet Class A | | GOOGL | 178.20 | 1400 | |
| -- Alphabet Class C | | GOOG | 179.60 | 900 | |
| - Semiconductors | 45 | | | | |
| -- NVIDIA | 60 | NVDA | 121.40 | 1600 | |
| -- ASML | 40 | ASML | 712.30 | 800 | |
| - Microsoft | 25 | MSFT | 421.80 | 1200 | |
| Healthcare | 20 | | | | |
| - Eli Lilly | 55 | LLY | 812.50 | 900 | |
| - Novo Nordisk | 45 | NVO | 118.70 | 600 | |
| Financials | 25 | | | | |
| - JPMorgan | 50 | JPM | 212.40 | 1100 | |
| - Visa | 50 | V | 289.10 | 700 | |
| Energy | 20 | | | | |
| - Shell | 60 | SHEL | 68.90 | 500 | |
| - TotalEnergies | 40 | TTE | 64.20 | 300 | |

## By asset class

> Funds, single names, property and bonds each hold their own share, so one of them
> growing fast does not decide the mix for you.

| Holding | Weight | Ticker | Price | Value | Kind |
|---|---|---|---|---|---|
| Equity ETFs | 45 | | | | |
| - S&P 500 | 60 | | | | shared |
| -- Vanguard S&P 500 | | VOO | 505.10 | 2000 | |
| -- iShares Core S&P 500 | | IVV | 551.30 | 1200 | |
| - World ex-US | 40 | VXUS | 62.40 | 2400 | |
| Individual stocks | 20 | | | | equal |
| - Berkshire Hathaway | | BRK-B | 452.80 | 900 | |
| - Costco | | COST | 878.40 | 700 | |
| - LVMH | | MC.PA | 615.40 | 400 | |
| Real assets | 20 | | | | |
| - US REITs | 70 | VNQ | 92.60 | 900 | |
| - Gold | 30 | IAU | 48.70 | 400 | |
| Bonds | 15 | | | | |
| - Treasuries | 60 | GOVT | 22.90 | 700 | |
| - Corporate | 40 | LQD | 108.30 | 400 | |
