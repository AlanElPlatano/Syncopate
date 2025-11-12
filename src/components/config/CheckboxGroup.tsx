import { ChangeEvent } from 'react';
import './CheckboxGroup.css';

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  minSelections?: number;
  error?: string;
}

export const CheckboxGroup = ({
  label,
  options,
  selectedValues,
  onChange,
  minSelections = 1,
  error,
}: CheckboxGroupProps) => {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      // Prevent unchecking if it would go below minimum
      if (selectedValues.length > minSelections) {
        onChange(selectedValues.filter((v) => v !== value));
      }
    }
  };

  return (
    <div className="checkbox-group">
      <label className="checkbox-group-label">{label}</label>
      {minSelections > 1 && (
        <p className="checkbox-group-hint">Select at least {minSelections} options</p>
      )}

      <div className="checkbox-options">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.value);
          const isOnlySelected = isChecked && selectedValues.length === minSelections;

          return (
            <label
              key={option.value}
              className={`checkbox-option ${isChecked ? 'checked' : ''} ${
                isOnlySelected ? 'locked' : ''
              }`}
            >
              <input
                type="checkbox"
                value={option.value}
                checked={isChecked}
                onChange={handleCheckboxChange}
                disabled={isOnlySelected}
              />
              <div className="checkbox-content">
                <span className="checkbox-label">{option.label}</span>
                {option.description && (
                  <span className="checkbox-description">{option.description}</span>
                )}
              </div>
              <span className="checkbox-checkmark">✓</span>
            </label>
          );
        })}
      </div>

      {error && <div className="checkbox-group-error">{error}</div>}
    </div>
  );
};
