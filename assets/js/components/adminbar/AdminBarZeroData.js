/**
 * Admin Bar Zero Data component.
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const AdminBarZeroData = () => {
	return (
		<div>
			<div className="googlesitekit-adminbar__subtitle googlesitekit-font-weight-bold">
				{ __( 'No data available yet', 'google-site-kit' ) }
			</div>
			<div className="googlesitekit-adminbar__subtitle">
				{ __(
					'There is no data available for this content yet. This could be because it was recently created or because nobody has accessed it so far.',
					'google-site-kit'
				) }
			</div>
		</div>
	);
};

export default AdminBarZeroData;
