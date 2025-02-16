/**
 * GA4 Property Select component.
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
 * External dependencies
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __, _x, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { ProgressBar } from 'googlesitekit-components';
import { Select, Option } from '../../../../material-components';
import {
	MODULES_ANALYTICS_4,
	PROPERTY_CREATE,
} from '../../datastore/constants';
import { MODULES_ANALYTICS } from '../../../analytics/datastore/constants';
import { isValidAccountID } from '../../../analytics/util';
import { isValidPropertySelection } from '../../utils/validation';
import { trackEvent } from '../../../../util';
import useViewContext from '../../../../hooks/useViewContext';
const { useSelect, useDispatch } = Data;

export default function PropertySelect( {
	label,
	hasModuleAccess,
	className,
	onChange = () => {},
} ) {
	// Analytics accounts need to be loaded in order to load the properties,
	// otherwise this component will stay in a loading state forever.
	// eslint-disable-next-line no-unused-vars
	const accounts = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getAccounts()
	);

	// TODO: Update this select hook to pull accountID from the modules/analytics-4 datastore when GA4 module becomes separated from the Analytics one
	const accountID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getAccountID()
	);

	const properties = useSelect( ( select ) => {
		if ( hasModuleAccess === false ) {
			return null;
		}

		return select( MODULES_ANALYTICS_4 ).getProperties( accountID ) || [];
	} );

	const propertyID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).getPropertyID()
	);

	const propertyIDs = ( properties || [] ).map( ( { _id } ) => _id );

	const measurementIDs = useSelect( ( select ) => {
		if ( ! properties?.length ) {
			return null;
		}

		return select(
			MODULES_ANALYTICS_4
		).getMatchedMeasurementIDsByPropertyIDs( propertyIDs );
	} );

	const areMeasurementIDsResolving = useSelect( ( select ) => {
		if ( properties === undefined ) {
			return true;
		}

		if ( ! properties || properties?.length === 0 ) {
			return false;
		}

		return ! select( MODULES_ANALYTICS_4 ).hasFinishedResolution(
			'getWebDataStreamsBatch',
			[ propertyIDs ]
		);
	} );

	const isLoading = useSelect(
		( select ) =>
			! select( MODULES_ANALYTICS ).hasFinishedResolution(
				'getAccounts'
			) ||
			! select( MODULES_ANALYTICS_4 ).hasFinishedResolution(
				'getProperties',
				[ accountID ]
			) ||
			select( MODULES_ANALYTICS ).hasFinishedSelectingAccount() ===
				false ||
			areMeasurementIDsResolving
	);

	const { selectProperty } = useDispatch( MODULES_ANALYTICS_4 );

	const viewContext = useViewContext();

	const onPropertyChange = useCallback(
		( index, item ) => {
			const newPropertyID = item.dataset.value;
			if ( propertyID !== newPropertyID ) {
				const action =
					newPropertyID === PROPERTY_CREATE
						? 'change_property_new'
						: 'change_property';
				selectProperty( newPropertyID );
				trackEvent( `${ viewContext }_analytics`, action, 'ga4' );
				onChange();
			}
		},
		[ onChange, propertyID, selectProperty, viewContext ]
	);

	if ( ! isValidAccountID( accountID ) ) {
		return null;
	}

	if ( isLoading ) {
		return <ProgressBar height={ 100 } small />;
	}

	const isValidSelection =
		propertyID === undefined || propertyID === ''
			? true
			: isValidPropertySelection( propertyID );

	if ( hasModuleAccess === false ) {
		return (
			<Select
				className={ classnames(
					'googlesitekit-analytics__select-property',
					className
				) }
				label={ label || __( 'Property', 'google-site-kit' ) }
				value={ propertyID }
				enhanced
				outlined
				disabled
			>
				<Option value={ propertyID }>{ propertyID }</Option>
			</Select>
		);
	}

	return (
		<Select
			className={ classnames(
				'googlesitekit-analytics__select-property',
				'googlesitekit-analytics-4__select-property',
				className,
				{
					'googlesitekit-analytics-4__select-property--with-access':
						hasModuleAccess === true,
					'mdc-select--invalid': ! isValidSelection,
				}
			) }
			label={ label || __( 'Property', 'google-site-kit' ) }
			value={ propertyID }
			onEnhancedChange={ onPropertyChange }
			disabled={ ! isValidAccountID( accountID ) }
			enhanced
			outlined
		>
			{ ( properties || [] )
				.concat( {
					_id: PROPERTY_CREATE,
					displayName: __(
						'Set up a new property',
						'google-site-kit'
					),
				} )
				.map( ( { _id, displayName }, index ) => (
					<Option key={ index } value={ _id }>
						{ _id === PROPERTY_CREATE || ! measurementIDs?.[ _id ]
							? displayName
							: sprintf(
									/* translators: 1: Property name. 2: Measurement ID. */
									_x(
										'%1$s (%2$s)',
										'Analytics property name and ID',
										'google-site-kit'
									),
									displayName,
									measurementIDs?.[ _id ] || ''
							  ) }
					</Option>
				) ) }
		</Select>
	);
}

PropertySelect.propTypes = {
	label: PropTypes.string,
	hasModuleAccess: PropTypes.bool,
	className: PropTypes.string,
	onChange: PropTypes.func,
};
