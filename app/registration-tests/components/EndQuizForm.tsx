'use client';

import React, { useState } from 'react';
import { TeamInfo } from '../types';
import Icon from './Icon';

interface EndQuizFormProps {
  teamInfo: TeamInfo;
  setTeamInfo: (info: TeamInfo) => void;
  onSubmit: () => void;
}

const EndQuizForm: React.FC<EndQuizFormProps> = ({ teamInfo, setTeamInfo, onSubmit }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeamInfo({ ...teamInfo, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!teamInfo.preferredTeamNumber || teamInfo.preferredTeamNumber.trim() === '') {
      newErrors.preferredTeamNumber = 'Preferred team number is required';
    }

    if (!teamInfo.alternativeTeamNumber || teamInfo.alternativeTeamNumber.trim() === '') {
      newErrors.alternativeTeamNumber = 'Alternative team number is required';
    }

    if (teamInfo.vehicleCategory === 'CV') {
      if (!teamInfo.fuelType || teamInfo.fuelType.trim() === '') {
        newErrors.fuelType = 'Fuel type is required for CV teams';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit();
      } catch (error) {
        console.error('Submission error:', error);
        alert('An error occurred during submission. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Additional Information</h2>
          <p className="mt-2 text-gray-500">Please provide your team number preferences and additional details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="preferredTeamNumber" className="block text-sm font-medium text-gray-700">
              Preferred Team Number *
            </label>
            <input
              type="text"
              name="preferredTeamNumber"
              id="preferredTeamNumber"
              value={teamInfo.preferredTeamNumber || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.preferredTeamNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={teamInfo.vehicleCategory === 'EV' ? 'e.g., E88' : 'e.g., C12'}
              required
            />
            {errors.preferredTeamNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.preferredTeamNumber}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {teamInfo.vehicleCategory === 'EV' 
                ? 'Enter your preferred team number (e.g., E88, E01)' 
                : 'Enter your preferred team number (e.g., C12, C05)'}
            </p>
          </div>

          <div>
            <label htmlFor="alternativeTeamNumber" className="block text-sm font-medium text-gray-700">
              Alternative Team Number *
            </label>
            <input
              type="text"
              name="alternativeTeamNumber"
              id="alternativeTeamNumber"
              value={teamInfo.alternativeTeamNumber || ''}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.alternativeTeamNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={teamInfo.vehicleCategory === 'EV' ? 'e.g., E99' : 'e.g., C25'}
              required
            />
            {errors.alternativeTeamNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.alternativeTeamNumber}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Enter an alternative team number in case your preferred number is not available
            </p>
          </div>

          {teamInfo.vehicleCategory === 'CV' && (
            <div>
              <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                id="fuelType"
                value={teamInfo.fuelType || ''}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.fuelType ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select fuel type</option>
                <option value="RON98">RON98</option>
                <option value="E85">E85</option>
              </select>
              {errors.fuelType && (
                <p className="mt-1 text-sm text-red-600">{errors.fuelType}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select the fuel type your combustion vehicle will use
              </p>
            </div>
          )}

          <div className="flex items-start bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Icon name="info" className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-blue-800 font-medium">Note:</p>
              <p className="text-sm text-blue-700 mt-1">
                Team numbers will be assigned based on availability. Your preferences will be considered during the assignment process.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full max-w-xs flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white transition-all duration-200 transform ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Icon name="submit" className="h-5 w-5 mr-2" />
                  Complete Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EndQuizForm;

