import { useMemo, useState } from 'react'
import donationIllustration from '../assets/image3.jpg.jpg'

const donationPresets = [1000, 2500, 5000, 10000]
const currencyOptions = [
  { code: 'KES', label: 'Kenyan Shilling' },
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
]

export default function Donate() {
  const [donationFrequency, setDonationFrequency] = useState('one-time')
  const [donationAmount, setDonationAmount] = useState('2500')
  const [donationCurrency, setDonationCurrency] = useState('KES')

  const donationAmountValue = Number(donationAmount) || 0
  const formattedDonationAmount = donationAmountValue
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: donationCurrency }).format(donationAmountValue)
    : `${donationCurrency} 0`

  const frequencyOptions = useMemo(
    () => [
      { value: 'one-time', label: 'One-off' },
      { value: 'monthly', label: 'Monthly' },
    ],
    []
  )

  return (
    <main className="space-y-8">
      <section className="donate-section grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="donate-panel">
          <p className="donate-eyebrow">Donate now</p>
          <h1 className="text-3xl font-semibold">Empower rapid response</h1>
          <p className="text-3xl font-semibold mt-1 mb-2 text-slate-700 dark:text-slate-100">Your support matters a lot, let's save lives</p>
          <p className="text-slate-600 dark:text-slate-200/90">Choose the frequency and currency that work for you—every contribution keeps safe spaces staffed and responders supported.</p>

          <div className="donation-frequency" role="group" aria-label="Donation frequency">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`frequency-pill ${donationFrequency === option.value ? 'active' : ''}`}
                onClick={() => setDonationFrequency(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="donation-controls">
            <label htmlFor="donation-amount" className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Amount in {donationCurrency}
            </label>
            <div className="donation-input">
              <span className="currency-prefix">{donationCurrency}</span>
              <input
                id="donation-amount"
                type="number"
                min="100"
                value={donationAmount}
                onChange={(event) => setDonationAmount(event.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="currency-select">
            <label htmlFor="currency" className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Choose currency
            </label>
            <select id="currency" value={donationCurrency} onChange={(event) => setDonationCurrency(event.target.value)}>
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="donation-presets">
            {donationPresets.map((amount) => (
              <button
                key={amount}
                type="button"
                className={`preset-pill ${donationAmount === amount.toString() ? 'active' : ''}`}
                onClick={() => setDonationAmount(amount.toString())}
              >
                {amount.toLocaleString()} {donationCurrency}
              </button>
            ))}
          </div>

          <p className="donation-summary text-sm text-slate-500 dark:text-slate-200">
            You’re setting up a {donationFrequency === 'one-time' ? 'one-off' : 'recurring monthly'} gift of <strong>{formattedDonationAmount}</strong>.
          </p>

          <button type="button" className="btn btn-primary donate-btn">
            Proceed with {donationFrequency === 'one-time' ? 'one-off' : 'monthly'} donation
          </button>
        </div>
        <figure className="donate-illustration rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <img src={donationIllustration} alt="Group united under the End GBV message" />
        </figure>
      </section>
    </main>
  )
}
