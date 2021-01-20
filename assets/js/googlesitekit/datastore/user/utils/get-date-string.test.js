/**
 * `core/user` getDateString utility tests.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { INVALID_DATE_INSTANCE_ERROR } from './constants';
import { getDateString } from './get-date-string';

describe( 'getDateString', () => {
	it( 'should throw error if no param is passed', () => {
		try {
			getDateString();
		} catch ( error ) {
			expect( error.message ).toEqual( INVALID_DATE_INSTANCE_ERROR );
		}
	} );

	it( 'should throw error if date param is not a valid date constructor value', () => {
		try {
			getDateString( 'invalid-date' );
		} catch ( error ) {
			expect( error.message ).toEqual( INVALID_DATE_INSTANCE_ERROR );
		}
	} );

	const JANUARY = 0; // month is 0 indexed
	const date = new Date( 2020, JANUARY, 1 );
	const time = date.getTime();
	const isoString = date.toISOString();
	const gmtString = date.toGMTString();
	const utcString = date.toUTCString();

	// [ testName, dateInstance, expectedReturnDate ]
	const valuesToTest = [
		[ 'should return "2020-01-01" for date instance of the same date', date, '2020-01-01' ],
		[ `should return "2020-01-01" for millisecond value (${ time }) of the same date`, time, '2020-01-01' ],
		[ `should return "2020-01-01" for ISO string (${ isoString }) value of the same date`, isoString, '2020-01-01' ],
		[ `should return "2020-01-01" for GMT string (${ gmtString }) value of the same date`, gmtString, '2020-01-01' ],
		[ `should return "2020-01-01" for UTC string (${ utcString }) value of the same date`, utcString, '2020-01-01' ],
	];

	it.each( valuesToTest )( '%s', ( _testName, dateInstance, expected ) => {
		expect( getDateString( dateInstance ) ).toEqual( expected );
	} );
} );
