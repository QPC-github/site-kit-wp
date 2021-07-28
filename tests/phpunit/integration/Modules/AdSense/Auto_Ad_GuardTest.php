<?php
/**
 * Class Google\Site_Kit\Tests\Modules\AdSense\Auto_Ad_GuardTest
 *
 * @package   Google\Site_Kit\Tests\Modules\AdSense
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Modules\AdSense;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Storage\Options;
use Google\Site_Kit\Modules\AdSense\Settings;
use Google\Site_Kit\Modules\AdSense\Auto_Ad_Guard;
use Google\Site_Kit\Tests\TestCase;

/**
 * @group Modules
 * @group AdSense
 */
class Auto_Ad_GuardTest extends TestCase {

	public function test_can_activate() {
		$settings = new Settings( new Options( new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE ) ) );
		$guard    = new Auto_Ad_Guard( $settings );

		update_option(
			Settings::OPTION,
			array(
				'autoAdsDisabled' => array(),
			)
		);

		$this->assertTrue( $guard->can_activate() );
	}

	public function test_cant_activate() {
		$settings = new Settings( new Options( new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE ) ) );
		$guard    = new Auto_Ad_Guard( $settings );

		// Login basic user
		$user_id = $this->factory()->user->create();
		wp_set_current_user( $user_id );

		update_option(
			Settings::OPTION,
			array(
				'autoAdsDisabled' => array( 'loggedinUsers' ),
			)
		);

		$this->assertFalse( $guard->can_activate(), 'Should return FALSE when loggedinUsers is set.' );

		update_option(
			Settings::OPTION,
			array(
				'autoAdsDisabled' => array( 'contentCreators' ),
			)
		);

		$this->assertFalse( $guard->can_activate(), 'Should return FALSE when contentCreators is set.' );
	}

}
